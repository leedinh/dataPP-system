from .db import db
import enum
import os


from datetime import datetime


class Dataset(db.Model):
    __tablename__ = 'dataset'

    did = db.Column(db.String(50), primary_key=True)
    uid = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=False, default='anonymous')
    path = db.Column(db.String(255), nullable=False)
    description =  db.Column(db.String(255))
    date = db.Column(db.Date, nullable=False)
    file_size = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(255))
    is_anonymized = db.Column(db.Boolean)
    status = db.Column(db.Enum('pending', 'anonymizing',
                       'completed', 'idle', 'failed'), default='idle', nullable=False)
    topic = db.Column(db.Integer)
    download_count = db.Column(db.Integer, default=0)

    def __init__(self, did, uid, name, path, file_size, author, status='idle'):
        self.did = did
        self.uid = uid
        self.filename = name
        self.file_size = file_size
        self.path = path
        self.date = datetime.now()
        self.status = status
        self.author = author

    def serialize(self):
        return {
            'did': self.did,
            'uid': self.uid,
            'filename': self.filename,
            'status': self.status,
            'date': self.date.isoformat(),
            'title': self.title,
            'is_anonymized': self.is_anonymized,
            'topic': self.topic,
            'author': self.author,
            'description': self.description,
            'download_count': self.download_count,
            'file_size': self.file_size
        }

    def inc_download(self):
        self.download_count += 1
        db.session.commit()

    @classmethod
    def get_datasets_with_most_download(cls):
        ds = cls.query.filter_by(status='completed')\
            .filter(cls.download_count>0)\
            .order_by(cls.download_count.desc())\
            .limit(5)\
            .all()
        return ds

    def update_author(self, author):
        self.author = author
        db.session.commit()

    def remove_datasets_by_uid(uid):
        try:
            # Retrieve all datasets with the given uid
            datasets = Dataset.query.filter_by(uid=uid).all()

            # Delete each dataset from the database
            for dataset in datasets:
                dataset.delete_from_db()

            # Commit the changes to the database
            db.session.commit()

            return True

        except Exception as e:
            # Handle any exceptions that may occur during the deletion process
            print(f"Error removing datasets for uid {uid}: {str(e)}")
            db.session.rollback()
            return False

    def update_info(self, title=None, is_anonymized=None, topic=None, description=None):
        # Update the attributes if they are not None
        self.title = title
        self.is_anonymized = is_anonymized
        self.topic = topic
        self.description = description
        # Save the changes to the database
        db.session.commit()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()
        DatasetStatusHistory.add_dataset_status_history(self.did, "idle")

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
        return Dataset.query.filter_by(uid=uid).\
        filter(Dataset.status.in_(('completed', 'pending', 'anonymizing','failed'))).all()
    
    @classmethod
    def admin_find_user_datasets(cls, uid):
        return Dataset.query.filter_by(uid=uid).all()

    @classmethod
    def find_all(cls):
        return cls.query.all()

    @classmethod
    def query_datasets_by_topic(cls, topic):
        return cls.query.filter_by(topic=topic).all()


    def update_status(self, new_status):
        self.status = new_status
        db.session.commit()
        DatasetStatusHistory.add_dataset_status_history(self.did, new_status)

    def delete_from_db(self):
        try:
            if self.is_anonymized and self.status in ['completed', 'failed']:
                result_path = os.path.join(self.path,'result.json')
                if os.path.exists(result_path):
                    os.remove(result_path)
            file_path = os.path.join(self.path,self.filename)
            if os.path.exists(file_path):
                    os.remove(file_path)
            if os.path.exists(self.path):
                os.rmdir(self.path)
            db.session.delete(self)
            db.session.commit()
            DatasetStatusHistory.add_dataset_status_history(self.did, "deleted")
        except Exception as err:
            db.session.rollback()
            raise err


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(80), unique=True, nullable=False)
    storage_count = db.Column(db.Integer,  default=0)
    username = db.Column(db.String(80), nullable=False, default='anonymous')
    hash_password = db.Column(db.String(120), nullable=False)
    upload_count = db.Column(db.Integer, default=0)

    def serialize(self):
        return {
            'id': self.id,
            'email': self.email,
            'username': self.username,
            'upload_count': self.upload_count,
            'storage_count': self.storage_count
        }

    def save_to_db(self):
        try:
            db.session.add(self)
            db.session.commit()
        except Exception as err:
            db.session.rollback()
            raise err
        
    def inc_storage(self, amount):
        try:
            self.storage_count += amount
            db.session.commit()
        except Exception as err:
            db.session.rollback()
            raise err

    def update_upload(self, count):
        self.upload_count = count
        db.session.commit()

    def inc_upload(self, count):
        self.upload_count += count
        db.session.commit()

    def delete_from_db(self):
        try:
            db.session.delete(self)
            db.session.commit()
        except Exception as err:
            db.session.rollback()
            raise err

    def update_username(self, new_username):
        self.username = new_username
        db.session.commit()

    @classmethod
    def get_users_with_most_uploads(cls):
        users = cls.query.filter(cls.upload_count > 0)\
                 .order_by(cls.upload_count.desc())\
                 .limit(5)\
                 .all()
        return users

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
        print(cls)
        return cls.query.all()


class Topic(db.Model):
    __tablename__ = 'topic'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)

    @classmethod
    def find_all(cls):
        return cls.query.all()
    
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()


class DatasetStatusHistory(db.Model):
    __tablename__ = 'dataset_status_history'
    id = db.Column(db.Integer(), primary_key=True)
    did = db.Column(db.String(50), nullable=False)
    status = db.Column(db.Enum('pending', 'anonymizing', 'completed',
                       'idle', 'deleted', 'failed', name='dataset_status'), nullable=False)
    timestamp = db.Column(db.DateTime(timezone=True),
                          server_default=db.func.now())

    def serialize(self):
        return {
            'id': self.id,
            'dataset_id': self.did,
            'status': self.status,
            'time': self.timestamp
        }

    @classmethod
    def add_dataset_status_history(cls, did: str, status: str):
        # Create a new dataset status history object
        dataset_status_history = DatasetStatusHistory(
            did=did,
            status=status
        )
        # Add the object to the database session
        try:
            db.session.add(dataset_status_history)

        # Commit the session to save the changes to the database
            db.session.commit()
        except Exception as e:
            print(e)

    @classmethod
    def find_by_did(cls, did):
        return cls.query.filter_by(did=did).all()


class DatasetTopic(db.Model):
    __tablename__ = 'dataset_topic'
    did = db.Column(db.String(50), db.ForeignKey(
        'dataset.did'), primary_key=True)
    tid = db.Column(db.Integer(), db.ForeignKey('topic.id'), primary_key=True)
