from .db import db
import enum


from datetime import date


class Dataset(db.Model):
    __tablename__ = 'dataset'

    did = db.Column(db.String(50), primary_key=True)
    uid = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=False, default='anonymize')
    path = db.Column(db.String(255), nullable=False)
    date = db.Column(db.Date, nullable=False)
    title = db.Column(db.String(255))
    is_anonymized = db.Column(db.Boolean)
    status = db.Column(db.Enum('pending', 'anonymizing',
                       'completed', 'idle'), default='idle', nullable=False)
    topic = db.Column(db.SmallInteger)

    def __init__(self, did, uid, name, path, author, status='idle'):
        self.did = did
        self.uid = uid
        self.filename = name
        self.path = path
        self.date = date.today()
        self.status = status
        self.author = author

    def serialize(self):
        return {
            'did': self.did,
            'uid': self.uid,
            'filename': self.filename,
            'date': self.date.isoformat(),
            'title': self.title,
            'is_anonymized': self.is_anonymized,
            'topic': self.topic,
            'author': self.author
        }

    def update_author(self, author):
        self.author = author
        db.session.commit()

    def update_info(self, title=None, is_anonymized=None, topic=None):
        # Update the attributes if they are not None
        self.title = title
        self.is_anonymized = is_anonymized
        self.topic = topic

        # Save the changes to the database
        db.session.commit()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def find_by_did(cls, did):
        return cls.query.filter_by(did=did).first()

    @classmethod
    def delete_all_datasets(cls):
        try:
            # Begin a database transaction
            db.session.begin()

            # Delete all records from the Dataset table
            cls.query.delete()

            # Commit the transaction
            db.session.commit()
            return True

        except Exception as e:
            # Rollback the transaction in case of an error
            db.session.rollback()
            raise e

    @classmethod
    def find_all_completed(cls):
        return cls.query.filter_by(status='completed').all()

    @classmethod
    def find_user_datasets(cls, uid):
        return cls.query.filter_by(uid=uid).all()

    @classmethod
    def find_all(cls):
        return cls.query.all()

    @classmethod
    def query_datasets_by_topic(cls, topic):
        return cls.query.filter_by(topic=topic).all()

    @classmethod
    def query_datasets_by_uid(cls, uid):
        return cls.query.filter_by(uid=uid).all()

    def update_status(self, new_status):
        self.status = new_status
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(80), unique=True, nullable=False)
    username = db.Column(db.String(80), nullable=False, default='anonymize')
    hash_password = db.Column(db.String(120), nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'email': self.email,
            'username': self.username
        }

    def save_to_db(self):
        try:
            db.session.add(self)
            db.session.commit()
        except Exception as err:
            db.session.rollback()
            raise err

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()

    def update_username(self, new_username):
        self.username = new_username
        db.session.commit()

    @classmethod
    def find_by_uid(cls, uid):
        return cls.query.filter_by(id=uid).first()

    @classmethod
    def find_by_email(cls, email):
        return cls.query.filter_by(email=email).first()

    @classmethod
    def delete_all_user(cls):
        try:
            # Begin a database transaction
            db.session.begin()

            # Delete all records from the Dataset table
            cls.query.delete()

            # Commit the transaction
            db.session.commit()
            return True

        except Exception as e:
            # Rollback the transaction in case of an error
            db.session.rollback()
            raise e

    @classmethod
    def find_all(cls):
        return cls.query.all()
