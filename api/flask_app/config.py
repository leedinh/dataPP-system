# !/usr/bin/env python
# -*- coding: utf-8 -*-
"""This module has configurations for flask app."""

import logging
import os
from datetime import timedelta
from dotenv import dotenv_values
CONFIG = {
    "development": "flask_app.config.DevelopmentConfig",
    "testing": "flask_app.config.TestingConfig",
    "production": "flask_app.config.ProductionConfig",
    "default": "flask_app.config.ProductionConfig"
}

env_vars = dotenv_values('.flaskenv')

class BaseConfig(object):
    """Base class for default set of configs."""

    DEBUG = False
    TESTING = False
    SECURITY_PASSWORD_HASH = 'pbkdf2_sha512'
    SECURITY_TRACKABLE = True
    LOGGING_FORMAT = "[%(asctime)s] [%(funcName)-30s] +\
                                    [%(levelname)-6s] %(message)s"
    LOGGING_LOCATION = 'web.log'
    LOGGING_LEVEL = logging.DEBUG
    SECURITY_TOKEN_MAX_AGE = 60 * 30
    SECURITY_CONFIRMABLE = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CACHE_TYPE = 'simple'
    SECURITY_PASSWORD_SALT = 'super-secret-stuff-here'
    COMPRESS_MIMETYPES = ['text/html', 'text/css', 'text/xml',
                          'application/json', 'application/javascript']

    WTF_CSRF_ENABLED = False
    COMPRESS_LEVEL = 6
    COMPRESS_MIN_SIZE = 500

    # Change it based on your admin user, should ideally read from DB.

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)


class DevelopmentConfig(BaseConfig):
    """Default set of configurations for development mode."""

    DEBUG = True
    TESTING = False
    BASEDIR = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = env_vars['POSGREST_URL']
    UPLOAD_FOLDER = env_vars['UPLOAD_FOLDER']
    ADMIN_USER = env_vars['ADMIN_USER']
    ADMIN_PASSWORD = env_vars['ADMIN_PASSWORD']
    BASIC_AUTH_USERNAME = ADMIN_USER
    BASIC_AUTH_PASSWORD = ADMIN_PASSWORD
    UPLOAD_FOLDER = "/home/nttv/Documents/HK222/Luan van/dataPP-system/upload"
    SECRET_KEY = 'not-so-super-secret'
    JWT_SECRET_KEY = env_vars['JWT_SECRET_KEY']


class ProductionConfig(BaseConfig):
    """Default set of configurations for prod mode."""

    DEBUG = False
    TESTING = False
    BASEDIR = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BASEDIR, 'app.db')
    SECRET_KEY = 'Super-awesome-secret-stuff'
    JWT_SECRET_KEY = 'another_super_awesome_secret_stuff_yo.'


class TestingConfig(BaseConfig):
    """Default set of configurations for test mode."""

    DEBUG = False
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite://'
    SECRET_KEY = '792842bc-c4df-4de1-9177-d5207bd9faa6'
    JWT_SECRET_KEY = 'another_super_awesome_secret_stuff_yo.'
