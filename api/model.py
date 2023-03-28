from db import db
import enum


from datetime import date


class Dataset(db.Model):
    __tablename__ = 'dataset'

    did = db.Column(db.String(50), primary_key=True)
    uid = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    path = db.Column(db.String(255), nullable=False)
    date = db.Column(db.Date, nullable=False)
    status = db.Column(db.Enum('pending', 'anonymizing',
                       'completed', 'idle'), default='idle', nullable=False)

    def __init__(self, did, uid, name, path, status='idle'):
        self.did = did
        self.uid = uid
        self.name = name
        self.path = path
        self.date = date.today()
        self.status = status

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def find_by_did(cls, did):
        return cls.query.filter_by(did=did).first()

    @classmethod
    def find_all(cls):
        return cls.query.all()

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
