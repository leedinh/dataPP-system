import time
from flask import Flask, jsonify, send_from_directory, request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt
from db import db
from model import User, Dataset
from rq_server import *
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

app = Flask(__name__, static_folder='../my-app/build', static_url_path='/')
app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this!
app.config['UPLOAD_FOLDER'] = "/Users/dinh.le/School/dataPP-system/upload"
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
jwt = JWTManager(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://myuser:mypassword@localhost:5432/mydatabase'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)


def task_anonymize(args, did):
    with app.app_context():
        ds = Dataset.find_by_did(did)
        ds.update_status('anonymizing')
        anonymizer = Anonymizer(args)
        anonymizer.anonymize()
        anonymizer.output(args['output'])
        ds.update_status('completed')


def task_delete_dataset(did):
    print("I am task")
    with app.app_context():
        ds = Dataset.find_by_did(did)
        if ds.status == 'idle':
            ds.delete_from_db()


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')


# handler for /api/check_token
@app.route('/api/check_token')
@jwt_required(optional=True)
def check_token():
    jwt = get_jwt()
    if jwt:
        # user is authenticated, access token is valid
        return jsonify(message='Access token is valid'), 200
    else:
        # user is not authenticated, access token is invalid
        return jsonify(message='Access token is invalid'), 401


@app.route('/api/clean_ds')
@jwt_required()
def clean_ds():
    ok = Dataset.delete_all_datasets()
    if ok:
        return 'Delete all dataset', 200


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
        return jsonify({"columns": list(ds.columns), "row": len(ds)}), 200
    else:
        return 'Dataset not found', 404


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
            return 'You have no access to this file', 400
        sec_level = int(args['sec_level'])
        # Parse security level
        if sec_level in range(30):
            k = 5
            min_sup = 0.3
            min_conf = 0.3
        if sec_level in range(30, 70):
            k = 15
            min_sup = 0.5
            min_conf = 0.5

        if sec_level in range(70, 100):
            k = 25
            min_sup = 0.7
            min_conf = 0.7

        param = {}
        param['qsi'] = [int(value) for value in args['qsi']]
        param['k'] = k
        param['sup'] = min_sup
        param['conf'] = min_conf
        param['input'] = os.path.join(ds.path, ds.filename)
        param['output'] = os.path.join(ds.path, ds.filename)
        print('Goodbye')
        rq_queue.enqueue(task_anonymize, param, str(did)
                         )  # enqueue the function
        ds.update_status('pending')
        return jsonify({"msg": "Task enqueued"}), 200
    else:
        return jsonify({"msg": 'Dataset not found'}), 404

# Route to generate JWT token


@app.route("/api/signup", methods=["POST"])
def signup():
    email = request.json.get("email")
    password = request.json.get("password")
    print(email, password)
    if not email or not password:
        return jsonify({"msg": "Email and password are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Email already registered"}), 409

    hashed_password = generate_password_hash(password)
    new_user = User(email=email, hash_password=hashed_password)
    print(new_user)
    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as err:
        print(err)
        db.session.rollback()
        return jsonify({"msg": "Failed to create user"}), 500

    return jsonify({"msg": "User created successfully"}), 201


@app.route('/api/datasets', methods=['GET'])
def get_all_datasets():
    try:
        # query = db.session.query(Dataset.did, Dataset.filename, User.email).join(
        #     User, Dataset.uid == User.id).all()

        # print(query)
        datasets = Dataset.find_all_completed()
        print(datasets)
        return jsonify([d.serialize() for d in datasets])
        # return jsonify([d.serialize() for d in datasets])
    except exc.SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/cheat', methods=['GET'])
def cheat():
    try:
        datasets = Dataset.find_all()
        return jsonify([d.serialize() for d in datasets])
    except exc.SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/datasets/<string:topic>', methods=['GET'])
def get_datasets_by_topic(topic):
    try:

        datasets = Dataset.query_datasets_by_topic(topic)
        return jsonify([d.serialize() for d in datasets])
    except exc.SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500


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


def generate_uuid():
    uuid_string = str(uuid.uuid4())

    # Generate the SHA-256 hash of the UUID
    hash_object = hashlib.sha256(uuid_string.encode())
    hash_hex = hash_object.hexdigest()

    # Take the first 8 characters of the hash as the unique ID
    unique_id = str(hash_hex[:10])
    return unique_id


@app.route('/api/metadata/<string:did>', methods=['GET'])
@jwt_required()
def get_metadata(did):
    dataset = Dataset.find_by_did(did)
    if dataset:
        path = os.path.join(dataset.path, dataset.filename)
        import pandas as pd
        ds = pd.read_csv(path)
        return jsonify({"columns": list(ds.columns), "row": len(ds)}), 200
    else:
        return 'Dataset not found', 400


@app.route('/api/downloads/<string:did>', methods=['GET'])
def download_file(did):
    print(did)
    ds = Dataset.find_by_did(did)
    print(ds)
    return send_from_directory(ds.path, ds.filename, as_attachment=True)


@app.route('/api/upload', methods=['POST'])
@jwt_required()
def upload_file():
    if 'file' not in request.files:
        return 'No file part in the request', 400

    file = request.files['file']
    if file.filename == '':
        return 'No file selected', 404

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

# Enqueue the task with the calculated execution time
    # job = rq_queue.enqueue_at(execute_at, task_delete_dataset, file_id)
    # print(job)

    # registry = ScheduledJobRegistry(queue=rq_queue)
    # print(job in registry)

    return jsonify({'msg': 'File uploaded successfully', 'file_id': file_id}), 200


@ app.route('/')
def index():
    return app.send_static_file('index.html')


@ app.route('/api/time')
def get_current_time():
    return {'time': time.time()}


# if __name__ == "__main__":
#     app.run()
