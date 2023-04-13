from db import db
import enum


from datetime import date


class Dataset(db.Model):
    __tablename__ = 'dataset'

    did = db.Column(db.String(50), primary_key=True)
    uid = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    path = db.Column(db.String(255), nullable=False)
    date = db.Column(db.Date, nullable=False)
    title = db.Column(db.String(255))
    is_anonymized = db.Column(db.Boolean)
    status = db.Column(db.Enum('pending', 'anonymizing',
                       'completed', 'idle'), default='idle', nullable=False)
    topic = db.Column(db.String(100))

    def __init__(self, did, uid, name, path, status='idle'):
        self.did = did
        self.uid = uid
        self.filename = name
        self.path = path
        self.date = date.today()
        self.status = status

    def serialize(self):
        return {
            'did': self.did,
            'uid': self.uid,
            'filename': self.filename,
            'path': self.path,
            'date': self.date.isoformat(),
            'title': self.title,
            'is_anonymized': self.is_anonymized,
            'status': self.status,
            'topic': self.topic
        }

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
    def find_all(cls):
        return cls.query.all()

    @classmethod
    def query_datasets_by_topic(cls, topic):
        return cls.query.filter_by(topic=topic).all()

    def update_status(self, new_status):
        self.status = new_status
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(80), unique=True, nullable=False)
    hash_password = db.Column(db.String(120), nullable=False)
