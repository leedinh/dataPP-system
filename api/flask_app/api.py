import time
from flask import Flask, jsonify, send_from_directory, request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt
# from task import *
import os
from werkzeug.security import generate_password_hash, check_password_hash
import psycopg2
import uuid
import hashlib
from datetime import timedelta
from sqlalchemy import exc
from anonymizer.anonymize import Anonymizer
from rq.registry import ScheduledJobRegistry
from datetime import datetime, timedelta
from pytz import timezone
from gevent.pywsgi import WSGIServer
import logging

from .rq_server import *
from .models import User, Dataset
from .http_codes import Status
from .factory import create_app

logger = logging.getLogger(__name__)
app = create_app()
jwt = JWTManager(app)


def task_anonymize(args, did):
    with app.app_context():
        ds = Dataset.find_by_did(did)
        ds.update_status('anonymizing')
        anonymizer = Anonymizer(args)
        anonymizer.anonymize()
        anonymizer.output(args['output'])
        ds.update_status('completed')


def task_delete_dataset(did):
    with app.app_context():
        ds = Dataset.find_by_did(did)
        if ds.status == 'idle':
            ds.delete_from_db()


def generate_uuid():
    uuid_string = str(uuid.uuid4())

    # Generate the SHA-256 hash of the UUID
    hash_object = hashlib.sha256(uuid_string.encode())
    hash_hex = hash_object.hexdigest()

    # Take the first 8 characters of the hash as the unique ID
    unique_id = str(hash_hex[:10])
    return unique_id


""" User Api
/api/check_token
/api/signup
/api/login
"""


@app.route('/api/check_token')
@jwt_required(optional=True)
def check_token():
    jwt = get_jwt()
    if jwt:
        # user is authenticated, access token is valid
        return jsonify(message='Access token is valid'), Status.HTTP_OK_BASIC
    else:
        # user is not authenticated, access token is invalid
        return jsonify(message='Access token is invalid'), Status.HTTP_BAD_UNAUTHORIZED


@app.route("/api/signup", methods=["POST"])
def signup():
    email = request.json.get("email")
    password = request.json.get("password")
    print(email, password)
    if not email or not password:
        return jsonify({"msg": "Email and password are required"}), Status.HTTP_BAD_REQUEST

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Email already registered"}), Status.HTTP_BAD_CONFLICT

    hashed_password = generate_password_hash(password)
    new_user = User(email=email, hash_password=hashed_password)
    print(new_user)
    try:
        new_user.save_to_db()
        return jsonify({"msg": "User created successfully"}), Status.HTTP_OK_CREATED
    except:
        return jsonify({"msg": "Failed to create user"}), Status.HTTP_SERVICE_UNAVAILABLE


@app.route("/api/login", methods=["POST"])
def login():
    email = request.json.get("email")
    password = request.json.get("password")

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.hash_password, password):
        return jsonify({"msg": "Bad username or password"}), 401

    userId = user.id
    custom_claims = {'user_id': userId}
    access_token = create_access_token(
        identity=email, additional_claims=custom_claims)
    return jsonify(access_token=access_token), 200


""" Dataset Api
"""


@app.route('/api/upload', methods=['POST'])
@jwt_required()
def upload_file():
    if 'file' not in request.files:
        return 'No file part in the request', Status.HTTP_BAD_REQUEST

    file = request.files['file']
    if file.filename == '':
        return 'No file selected', Status.HTTP_BAD_NOTFOUND

    claims = get_jwt()
    user_id = claims['user_id']
    user = User.find_by_uid(user_id)
    file_id = generate_uuid()
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], user_id, file_id)

    if not os.path.exists(file_path):
        os.makedirs(file_path)

    file.save(os.path.join(file_path, file.filename))

    dataset = Dataset(file_id, user_id, file.filename,
                      file_path, user.username)
    dataset.save_to_db()

    delay_seconds = 10

# Create a timedelta object from the delay_seconds
    delay = timedelta(seconds=delay_seconds)

# Calculate the datetime for when the task should be executed
    execute_at = datetime.utcnow() + delay

    logger.info("Add task")

# Enqueue the task with the calculated execution time
    job = rq_queue.enqueue_at(execute_at, task_delete_dataset, file_id)
    print(job)

    # registry = ScheduledJobRegistry(queue=rq_queue)
    # print(job in registry)

    return jsonify({'msg': 'File uploaded successfully', 'file_id': file_id}), Status.HTTP_OK_CREATED


@app.route('/api/update_info/<string:did>', methods=['PATCH'])
@jwt_required()
def update_info(did):
    ds = Dataset.find_by_did(did)
    if ds:
        args = request.json
        ds.update_info(args['title'], args['is_anonymized'], args['topic'])

        path = os.path.join(ds.path, ds.filename)
        import pandas as pd
        ds = pd.read_csv(path)
        return jsonify({"columns": list(ds.columns), "row": len(ds)}), Status.HTTP_OK_CREATED
    else:
        return 'Dataset not found', Status.HTTP_BAD_NOTFOUND


@app.route('/api/anonymize/<string:did>', methods=['POST'])
@jwt_required()
def enqueue_anonymize(did):
    ds = Dataset.find_by_did(did)
    if ds:
        # if ds.status != 'idle':
        #     return 'May be dataset has been anonymized', 404
        args = request.json  # assuming you're sending arguments in the request body
        claims = get_jwt()
        user_id = claims['user_id']
        if user_id != str(ds.uid):
            return 'You have no access to this file', Status.HTTP_BAD_FORBIDDEN
        sec_level = int(args['sec_level'])
        rule_level = int(args['rule_level'])
        # Parse security level
        if sec_level in range(30):
            k = 5
        if sec_level in range(30, 70):
            k = 15
        if sec_level in range(70, 100):
            k = 23

        min_conf = 0.6
        if rule_level in range(30):
            min_sup = 0.6
        if rule_level in range(30, 70):
            min_sup = 0.4
        if rule_level in range(70, 100):
            min_sup = 0.2

        param = {}
        param['qsi'] = [int(value) for value in args['qsi']]
        param['k'] = k
        param['sup'] = min_sup
        param['conf'] = min_conf
        param['input'] = os.path.join(ds.path, ds.filename)
        param['output'] = os.path.join(ds.path, ds.filename)
        rq_queue.enqueue(task_anonymize, param, str(did)
                         )  # enqueue the function
        ds.update_status('pending')
        return jsonify({"msg": "Task enqueued"}), Status.HTTP_OK_ACCEPTED
    else:
        return jsonify({"msg": 'Dataset not found'}), Status.HTTP_BAD_NOTFOUND


@app.route('/api/datasets', methods=['GET'])
def get_all_datasets():
    try:
        datasets = Dataset.find_all_completed()
        print(datasets)
        return jsonify([d.serialize() for d in datasets]), Status.HTTP_OK_BASIC
        # return jsonify([d.serialize() for d in datasets])
    except exc.SQLAlchemyError as e:
        return jsonify({'error': str(e)}), Status.HTTP_SERVICE_UNAVAILABLE


@app.route('/api/datasets/<string:topic>', methods=['GET'])
def get_datasets_by_topic(topic):
    try:

        datasets = Dataset.query_datasets_by_topic(topic)
        return jsonify([d.serialize() for d in datasets]), Status.HTTP_OK_BASIC
    except exc.SQLAlchemyError as e:
        return jsonify({'error': str(e)}), Status.HTTP_SERVICE_UNAVAILABLE


@app.route('/api/metadata/<string:did>', methods=['GET'])
@jwt_required()
def get_metadata(did):
    dataset = Dataset.find_by_did(did)
    if dataset:
        path = os.path.join(dataset.path, dataset.filename)
        import pandas as pd
        ds = pd.read_csv(path)
        return jsonify({"columns": list(ds.columns), "row": len(ds)}), Status.HTTP_OK_BASIC
    else:
        return 'Dataset not found', Status.HTTP_BAD_NOTFOUND


@app.route('/api/downloads/<string:did>', methods=['GET'])
def download_file(did):
    ds = Dataset.find_by_did(did)
    return send_from_directory(ds.path, ds.filename, as_attachment=True)


""" Cheat Api
"""


@app.route('/api/cheat', methods=['GET'])
def cheat():
    try:
        datasets = Dataset.find_all()
        return jsonify([d.serialize() for d in datasets])
    except exc.SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/clean_ds')
@jwt_required()
def clean_ds():
    ok = Dataset.delete_all_datasets()
    if ok:
        return 'Delete all dataset', 200


@ app.route('/api/time')
def get_current_time():
    return {'time': time.time()}


def main():
    try:
        port = 5050
        ip = '0.0.0.0'
        http_server = WSGIServer(
            (ip, port), app, log=logging, error_log=logging)
        print("Server started at : {0}:{1}".format(ip, port))
        http_server.serve_forever()
    except Exception as exec:
        logger.error(exec.message)
        logger.exception(traceback.format_exc())
    finally:
        pass
