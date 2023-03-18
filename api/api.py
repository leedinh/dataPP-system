import time
from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from db import db
from model import User
from rq_server import *
from task import *
import os
import psycopg2


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


@app.route("/api/login", methods=["POST"])
def login():
    email = request.json.get("email")
    password = request.json.get("password")

    user = User.query.filter_by(email=email).first()
    if not user or password != user.password:
        return jsonify({"msg": "Bad username or password"}), 401

    userId = user.id
    custom_claims = {'role': 'admin', 'user_id': userId}
    access_token = create_access_token(
        identity=email, additional_claims=custom_claims)
    return jsonify(access_token=access_token)

# Protected route


def secure_filename(name):
    return 'secure_' + name


@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file part in the request', 400

    file = request.files['file']

    if file.filename == '':
        return 'No file selected', 400

    if file:
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return 'File uploaded successfully', 200

    return 'Invalid file type', 400


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
