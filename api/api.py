import time
from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt
from db import db
from model import User
from rq_server import *
from task import *
import os
from werkzeug.security import generate_password_hash, check_password_hash
import psycopg2
import uuid
import hashlib


app = Flask(__name__, static_folder='../my-app/build', static_url_path='/')
app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this!
app.config['UPLOAD_FOLDER'] = "/Users/dinh.le/School/dataPP-system/upload"
jwt = JWTManager(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://myuser:mypassword@localhost:5432/mydatabase'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')


@app.route('/api/anonymize', methods=['POST'])
def enqueue_anonymize():
    args = request.json  # assuming you're sending arguments in the request body
    rq_queue.enqueue(anonymize, args)  # enqueue the function
    return 'Task enqueued'

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
    return jsonify(access_token=access_token)

# Protected route


def secure_filename(name):
    return 'secure_' + name


def generate_uuid():
    uuid_string = str(uuid.uuid4())

    # Generate the SHA-256 hash of the UUID
    hash_object = hashlib.sha256(uuid_string.encode())
    hash_hex = hash_object.hexdigest()

    # Take the first 8 characters of the hash as the unique ID
    unique_id = str(hash_hex[:10])
    return unique_id


@app.route('/api/upload', methods=['POST'])
@jwt_required()
def upload_file():
    if 'file' not in request.files:
        return 'No file part in the request', 400

    file = request.files['file']
    if file.filename == '':
        return 'No file selected', 400

    claims = get_jwt()
    user_id = claims['user_id']
    file_id = generate_uuid()
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], user_id, file_id)

    if not os.path.exists(file_path):
        os.makedirs(file_path)

    file.save(os.path.join(file_path, file.filename))

    return 'File uploaded successfully', 200


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
