import re
import time
from flask import jsonify, send_from_directory, request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt
from flask_basicauth import BasicAuth
import os
from werkzeug.security import generate_password_hash, check_password_hash
import psycopg2
import shutil
import uuid
import hashlib
from datetime import timedelta
from sqlalchemy import exc
from anonymizer.anonymize import Anonymizer
from datetime import timedelta
from gevent.pywsgi import WSGIServer
import logging
import os

from .rq_server import *
from .models import User, Dataset, Topic, DatasetStatusHistory
from .http_codes import Status
from .factory import create_app

logger = logging.getLogger(__name__)
app = create_app()
jwt = JWTManager(app)
basic_auth = BasicAuth(app)


USER_MAX_STORAGE = 3221225472


def callback_function(job, connection, type, value, traceback):
    with app.app_context():
    # Perform actions with the result
        print(f"Task result: ", job['_args'])




def task_anonymize(args, did):
    with app.app_context():
        ds = Dataset.find_by_did(did)
        ds.update_status('anonymizing')
        anonymizer = Anonymizer(args)
        anonymizer.anonymize()
        anonymizer.output(args['output'])
        ds.update_status('completed')


def task_check_dataset(did):
    with app.app_context():
        ds = Dataset.find_by_did(did)
        if ds and ds.status == 'idle':
            ds.delete_from_db()


def validate_email(email):
    email_pattern = r"[^@]+@[^@]+\.[^@]+"
    return re.match(email_pattern, email) is not None


def generate_uuid():
    uuid_string = str(uuid.uuid4())

    # Generate the SHA-256 hash of the UUID
    hash_object = hashlib.sha256(uuid_string.encode())
    hash_hex = hash_object.hexdigest()

    # Take the first 8 characters of the hash as the unique ID
    unique_id = str(hash_hex[:10])
    return unique_id


""" Admin Api  

"""
@app.route('/api/admin/check')
@basic_auth.required
def greet():
    return jsonify(msg='Admin xin chao'), Status.HTTP_OK_BASIC


@app.route('/api/admin/add/topic',  methods=["POST"])
@basic_auth.required
def add_topic():
    topic = Topic(name = request.json.get('name'))
    topic.save_to_db()
    return jsonify(msg='New topic added'), Status.HTTP_OK_BASIC

@app.route('/api/admin/users')
@basic_auth.required
def get_all_users():
    try:
        users = User.find_all()
        return jsonify([u.serialize() for u in users]), Status.HTTP_OK_BASIC
    except Exception as err:
        logger.info(err)
        return jsonify(msg="User not found"), Status.HTTP_BAD_NOTFOUND
    

    

@app.route('/api/admin/user/<string:uid>/delete', methods=["DELETE"])
@basic_auth.required
def delete_user(uid):
    try:
        user = User.find_by_uid(uid)
        if user:
            Dataset.remove_datasets_by_uid(user.id)
            user.delete_from_db()
            return jsonify(msg='User deleted'), Status.HTTP_OK_BASIC
        else:
            return jsonify(msg="User not found"), Status.HTTP_BAD_NOTFOUND
    except Exception as err:
        logger.info(err)
        return jsonify(msg="Something wrong"), Status.HTTP_BAD_REQUEST

@ app.route('/api/admin/user/<string:uid>/datasets', methods=['GET'])
def admin_get_all_user_datasets(uid):
    try:
        user = User.find_by_uid(uid)
        if not user:
            return jsonify(msg="User not found"), Status.HTTP_BAD_NOTFOUND
        datasets = Dataset.admin_find_user_datasets(uid)
        return jsonify([d.serialize() for d in datasets]), Status.HTTP_OK_BASIC
        # return jsonify([d.serialize() for d in datasets])
    except exc.SQLAlchemyError as e:
        return jsonify(error=str(e)), Status.HTTP_SERVICE_UNAVAILABLE


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
        return jsonify(msg='Access token is valid'), Status.HTTP_OK_BASIC
    else:
        # user is not authenticated, access token is invalid
        return jsonify(msg='Access token is invalid'), Status.HTTP_BAD_UNAUTHORIZED


@app.route("/api/signup", methods=["POST"])
def signup():
    email = request.json.get("email")
    password = request.json.get("password")
    if not email:
        return jsonify(msg="Email are required"), Status.HTTP_BAD_REQUEST
    if not password:
        return jsonify(msg="Password are required"), Status.HTTP_BAD_REQUEST

    if not validate_email(email):
        return jsonify(msg="Invalid email format"), Status.HTTP_BAD_REQUEST

    if User.query.filter_by(email=email).first():
        return jsonify(msg="Email already registered"), Status.HTTP_BAD_CONFLICT

    hashed_password = generate_password_hash(password)
    new_user = User(email=email, hash_password=hashed_password)
    try:
        new_user.save_to_db()
        return jsonify(msg="User created successfully"), Status.HTTP_OK_CREATED
    except:
        return jsonify(msg="Failed to create user"), Status.HTTP_SERVICE_UNAVAILABLE


@app.route("/api/login", methods=["POST"])
def login():
    email = request.json.get("email")
    password = request.json.get("password")

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.hash_password, password):
        return jsonify(msg="Bad username or password"), Status.HTTP_BAD_UNAUTHORIZED

    userId = user.id
    custom_claims = {'user_id': userId}
    access_token = create_access_token(
        identity=email, additional_claims=custom_claims)
    return jsonify(access_token=access_token), Status.HTTP_OK_ACCEPTED


@app.route('/api/user/<string:uid>')
def get_user(uid):
    user = User.find_by_uid(uid)
    if user:
        return jsonify(user.serialize()), Status.HTTP_OK_BASIC
    else:
        return jsonify(msg="User not found"), Status.HTTP_BAD_NOTFOUND


@app.route('/api/user/top_upload')
def get_top_upload_user():
    try:
        users = User.get_users_with_most_uploads()
        return jsonify([u.serialize() for u in users]), Status.HTTP_OK_BASIC
    except Exception as err:
        logger.info(err)
        return jsonify(msg="User not found"), Status.HTTP_BAD_NOTFOUND


@app.route('/api/user')
@jwt_required()
def get_user_info():
    claims = get_jwt()
    user_id = claims['user_id']
    user = User.find_by_uid(user_id)
    if user:
        return jsonify(user.serialize()), Status.HTTP_OK_BASIC
    else:
        return jsonify(msg="User not found"), Status.HTTP_BAD_NOTFOUND


@app.route('/api/user/update_info', methods=['PATCH'])
@jwt_required()
def update_user_info():
    claims = get_jwt()
    user_id = claims['user_id']
    user = User.find_by_uid(user_id)
    if user:
        args = request.json
        user.update_username(args['username'])
        dss = Dataset.find_user_datasets(user_id)
        for ds in dss:
            ds.update_author(user.username)
        return jsonify(msg='Username updated'), Status.HTTP_OK_CREATED
    else:
        return jsonify(msg='User not found'), Status.HTTP_BAD_NOTFOUND


@app.route('/api/user/delete', methods=['DELETE'])
@jwt_required()
def delete_account():
    claims = get_jwt()
    user_id = claims['user_id']
    user = User.find_by_uid(user_id)
    if user:
        user.delete_from_db()
        return jsonify(msg='Username deleted'), Status.HTTP_OK_ACCEPTED
    else:
        return jsonify(msg='User not found'), Status.HTTP_BAD_NOTFOUND

@ app.route('/api/user/datasets', methods=['GET'])
@ jwt_required()
def get_user_datasets():
    try:
        claims = get_jwt()
        user_id = claims['user_id']
        datasets = Dataset.find_user_datasets(user_id)
        return jsonify([d.serialize() for d in datasets]), Status.HTTP_OK_BASIC
        # return jsonify([d.serialize() for d in datasets])
    except exc.SQLAlchemyError as e:
        return jsonify(error=str(e)), Status.HTTP_SERVICE_UNAVAILABLE

""" Dataset Api
"""


@app.route('/api/dataset/upload', methods=['POST'])
@jwt_required()
def upload_file():
    if 'file' not in request.files:
        return jsonify(msg='No file part in the request'), Status.HTTP_BAD_REQUEST

    file = request.files['file']
    if file.filename == '':
        return jsonify(msg='No file selected'), Status.HTTP_BAD_NOTFOUND

    if not file.filename.endswith('.csv'):
        return jsonify(msg='File must have .csv extension'), Status.HTTP_BAD_REQUEST
    
    file_size = request.content_length
    claims = get_jwt()
    user_id = claims['user_id']
    user = User.find_by_uid(user_id)


    if not user:
        return jsonify(msg='Not found user'), Status.HTTP_BAD_NOTFOUND
    logger.info(type(user.storage_count))
    if user.storage_count + file_size > USER_MAX_STORAGE:
        return jsonify(msg='Exceed User Storage Capacity'), Status.HTTP_BAD_FORBIDDEN
    user.inc_storage(file_size)


    file_id = generate_uuid()
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], user_id, file_id)

    if not os.path.exists(file_path):
        os.makedirs(file_path)

    try:
        file.save(os.path.join(file_path, file.filename))

        dataset = Dataset(file_id, user_id, file.filename,
                          file_path, file_size, user.username)
        dataset.save_to_db()
    # Create a timedelta object from the delay_seconds
        delay = timedelta(minutes=5)
    # Calculate the datetime for when the task should be executed
        logger.info("Add task")
    # Enqueue the task with the calculated execution time
        rq_queue.enqueue_in(delay, task_check_dataset, file_id)
        return jsonify(msg='File uploaded successfully', file_id=file_id), Status.HTTP_OK_CREATED
    except Exception as e:
        logger.info(e)
        return jsonify(msg='Fail to upload'), Status.HTTP_BAD_CONFLICT


@app.route('/api/dataset/update_info/<string:did>', methods=['PATCH'])
@jwt_required()
def update_info(did):
    ds = Dataset.find_by_did(did)
    if ds:
        claims = get_jwt()
        user_id = claims['user_id']
        if user_id != str(ds.uid):
            return jsonify(msg='You have no access to this file'), Status.HTTP_BAD_FORBIDDEN
        user = User.find_by_uid(user_id)
        user.inc_upload(1)
        args = request.json
        ds.update_info(args['title'], args['is_anonymized'], args['topic'], args['description'])
        if not args['is_anonymized']:
            ds.update_status('completed')

        path = os.path.join(ds.path, ds.filename)
        import pandas as pd
        ds = pd.read_csv(path)
        return jsonify(columns=list(ds.columns), row=len(ds)), Status.HTTP_OK_CREATED
    else:
        return jsonify(msg='Dataset not found'), Status.HTTP_BAD_NOTFOUND


@ app.route('/api/dataset/anonymize/<string:did>', methods=['POST'])
@ jwt_required()
def enqueue_anonymize(did):
    ds = Dataset.find_by_did(did)
    if ds:
        if ds.status != 'idle':
            return jsonify(msg='The dataset is not idle'), Status.HTTP_BAD_CONFLICT
        args = request.json  # assuming you're sending arguments in the request body
        claims = get_jwt()
        user_id = claims['user_id']
        if user_id != str(ds.uid):
            return jsonify(msg='You have no access to this file'), Status.HTTP_BAD_FORBIDDEN
        sec_level = int(args['sec_level'])
        rule_level = int(args['rule_level'])
        # Parse security level
        if sec_level in range(30):
            k = 5
        if sec_level in range(30, 70):
            k = 15
        if sec_level in range(70, 101):
            k = 23

        min_conf = 0.6
        if rule_level in range(30):
            min_sup = 0.6
        if rule_level in range(30, 70):
            min_sup = 0.4
        if rule_level in range(70, 101):
            min_sup = 0.2

        param = {}
        param['qsi'] = [int(value) for value in args['qsi']]
        param['k'] = k
        param['sup'] = min_sup
        param['conf'] = min_conf
        param['input'] = os.path.join(ds.path, ds.filename)
        param['output'] = os.path.join(ds.path, ds.filename)
        rq_queue.enqueue(task_anonymize, args=(param, str(did)), on_failure=callback_function, )  # enqueue the function
        ds.update_status('pending')
        return jsonify(msg="Task enqueued"), Status.HTTP_OK_ACCEPTED
    else:
        return jsonify(msg='Dataset not found'), Status.HTTP_BAD_NOTFOUND



@ app.route('/api/datasets', methods=['GET'])
def get_all_datasets():
    try:
        datasets = Dataset.find_all_completed()
        return jsonify([d.serialize() for d in datasets]), Status.HTTP_OK_BASIC
        # return jsonify([d.serialize() for d in datasets])
    except exc.SQLAlchemyError as e:
        return jsonify(error=str(e)), Status.HTTP_SERVICE_UNAVAILABLE


@app.route('/api/dataset/top_download')
def get_top_download_dataset():
    try:
        datasets = Dataset.get_datasets_with_most_download()
        return jsonify([d.serialize() for d in datasets]), Status.HTTP_OK_BASIC
    except:
        return jsonify(msg="Dataset not found"), Status.HTTP_BAD_NOTFOUND


@ app.route('/api/datasets/<string:topic>', methods=['GET'])
def get_datasets_by_topic(topic):
    try:

        datasets = Dataset.query_datasets_by_topic(topic)
        return jsonify([d.serialize() for d in datasets]), Status.HTTP_OK_BASIC
    except exc.SQLAlchemyError as e:
        return jsonify(error=str(e)), Status.HTTP_SERVICE_UNAVAILABLE


@ app.route('/api/metadata/<string:did>', methods=['GET'])
@ jwt_required()
def get_metadata(did):
    dataset = Dataset.find_by_did(did)
    if dataset:
        path = os.path.join(dataset.path, dataset.filename)
        import pandas as pd
        ds = pd.read_csv(path)
        return jsonify(columns=list(ds.columns), row=len(ds)), Status.HTTP_OK_BASIC
    else:
        return jsonify(msg='Dataset not found'), Status.HTTP_BAD_NOTFOUND


@ app.route('/api/dataset/download/<string:did>', methods=['GET'])
def download_file(did):
    try:
        ds = Dataset.find_by_did(did)
        ds.inc_download()
        return send_from_directory(ds.path, ds.filename, as_attachment=True)
    except Exception as e:
        logger.info(e)


@app.route('/api/dataset/delete/<string:did>', methods=['DELETE'])
@jwt_required()
def delete_dataset(did):
    ds = Dataset.find_by_did(did)
    if ds:
        claims = get_jwt()
        user_id = claims['user_id']
        if user_id != str(ds.uid):
            return jsonify(msg='You have no access to this file'), Status.HTTP_BAD_FORBIDDEN
        ds.delete_from_db()
        user = User.find_by_uid(user_id)
        user.inc_upload(-1)
        return jsonify(msg='Dataset deleted'), Status.HTTP_OK_ACCEPTED
    else:
        return jsonify(msg='Dataset not found'), Status.HTTP_BAD_NOTFOUND


@app.route('/api/user/datasets/delete', methods=['DELETE'])
@jwt_required()
def delete_datasets():
    claims = get_jwt()
    user_id = claims['user_id']
    user = User.find_by_uid(user_id)
    try: 
        Dataset.remove_datasets_by_uid(user_id)
        user.update_upload(0)
        return jsonify(msg='Delete dataset success'), Status.HTTP_OK_ACCEPTED
    except:
        return jsonify(msg='Delete dataset failed'), Status.HTTP_BAD_REQUEST


""" Cheat Api
"""


@ app.route('/api/cheat', methods=['GET'])
def cheat():
    try:
        datasets = Dataset.find_all()
        return jsonify([d.serialize() for d in datasets])
    except exc.SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500


@ app.route('/api/clean_ds')
@ jwt_required()
def clean_ds():
    ok = Dataset.delete_all_datasets()
    if ok:
        return 'Delete all dataset', 200


@ app.route('/api/time')
def get_current_time():
    return {'time': time.time()}


@ app.route('/api/topics', methods=['GET'])
def get_topic():
    try:
        topics = Topic.find_all()
        topics = [topic.name for topic in topics]
        return jsonify(topic=topics), 200
    except:
        return jsonify(msg="Can not get topics"), 500


@ app.route('/api/dataset/history/<string:did>', methods=['GET'])
def get_dataset_history(did):
    try:
        histories = DatasetStatusHistory.find_by_did(did)

        return jsonify(histories=[history.serialize() for history in histories]), 200
    except:
        return jsonify(msg="Can not get histories"), 500


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
        # logger.exception(traceback.format_exc())
    finally:
        pass
