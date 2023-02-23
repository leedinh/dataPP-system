import time
from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from db import db
from model import User
import psycopg2


app = Flask(__name__, static_folder='../my-app/build', static_url_path='/')
app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this!
jwt = JWTManager(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://myuser:mypassword@localhost:5432/mydatabase'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')


users = {
    "test": "password"
}

# Route to generate JWT token


@app.route("/api/login", methods=["POST"])
def login():
    username = request.json.get("username")
    password = request.json.get("password")

    user = User.query.filter_by(username=username).first()
    print(type(user))
    if not user or password != user.password:
        return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token)

# Protected route


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


if __name__ == "__main__":
    app.run()
