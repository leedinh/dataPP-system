import time
from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt
from db import db
from model import User, Dataset
from rq_server import *
from task import *
import os
from werkzeug.security import generate_password_hash, check_password_hash
import psycopg2
import uuid
import hashlib
from datetime import timedelta
from sqlalchemy import exc

app = Flask(__name__, static_folder='../my-app/build', static_url_path='/')
app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this!
app.config['UPLOAD_FOLDER'] = "/Users/dinh.le/School/dataPP-system/upload"
app.config['RESULT_FOLDER'] = "/Users/dinh.le/School/dataPP-system/results"
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
jwt = JWTManager(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://myuser:mypassword@localhost:5432/mydatabase'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)


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


@app.route('/api/anonymize/<string:did>', methods=['POST'])
@jwt_required()
def enqueue_anonymize(did):
    ds = Dataset.find_by_did(did)
    if ds:
        args = request.json  # assuming you're sending arguments in the request body
        claims = get_jwt()
        user_id = claims['user_id']
        if user_id != str(ds.uid):
            return 'You have no access to this file', 400
        file_path = os.path.join(app.config['RESULT_FOLDER'], user_id, did)
        if not os.path.exists(file_path):
            os.makedirs(file_path)
        args['input'] = ds.path
        args['output'] = os.path.join(file_path, ds.filename)
        rq_queue.enqueue(anonymize, args)  # enqueue the function
        return 'Task enqueued', 200
    else:
        return 'Dataset not found', 404

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

# Protected route


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
        path = dataset.path
        import pandas as pd
        ds = pd.read_csv(path)
        return jsonify({"columns": list(ds.columns), "row": len(ds)}), 200
    else:
        return 'Dataset not found', 400


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
    file_id = generate_uuid()
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], user_id, file_id)

    if not os.path.exists(file_path):
        os.makedirs(file_path)

    file.save(os.path.join(file_path, file.filename))

    dataset = Dataset(file_id, user_id, file.filename,
                      os.path.join(file_path, file.filename))
    dataset.save_to_db()

    return jsonify({'msg': 'File uploaded successfully', 'file_id': file_id}), 200


@app.route("/api/protected", methods=["GET"])
@jwt_required()
def protected():
    return jsonify(foo="bar")


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/api/time')
def get_current_time():
    return {'time': time.time()}


# if __name__ == "__main__":
#     app.run()
