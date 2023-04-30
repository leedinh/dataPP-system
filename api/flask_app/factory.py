import os
from flask import Flask, jsonify, send_from_directory, request
from datetime import datetime, timedelta
from flask_cors import CORS
from .db import db
from .config import CONFIG


def create_app():
    app = Flask(__name__)
    config_name = os.getenv('FLASK_CONFIGURATION', 'development')
    app.config.from_object(CONFIG[config_name])
    db.init_app(app)
    CORS(app)
    return app
