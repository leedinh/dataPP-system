import unittest
from flask_app.models import User, Dataset
import json
import io


class FlaskTest(unittest.TestCase):

    def setUp(self):
        self.app = app
        with app.app_context():
            self.client = self.app.test_client()
            self.user_data = {'email': 'testuser123@example.com',
                              'password': 'password123'}
            self.exist_user = {'email': 'test@test.com',
                               'password': 'test'}
            self.client.post(
                '/api/signup', data=json.dumps(self.exist_user), content_type='application/json')

    def test_signup_valid_user(self):
        with app.app_context():
            user = User.find_by_email(self.user_data['email'])
            if user:
                user.delete_from_db()
            response = self.client.post(
                '/api/signup', data=json.dumps(self.user_data), content_type='application/json')
            self.assertEqual(response.status_code, 201)
            user = User.find_by_email(self.user_data['email'])
            self.assertEqual(user.email, self.user_data['email'])
            user.delete_from_db()

    def test_signup_noemail_user(self):
        with app.app_context():
            response = self.client.post(
                '/api/signup', data=json.dumps({'password': 'mypassword'}), content_type='application/json')
            self.assertEqual(response.status_code, 400)
            self.assertEqual(response.json['msg'], 'Email are required')

    def test_signup_nopassword_user(self):
        with app.app_context():
            response = self.client.post(
                '/api/signup', data=json.dumps({'email': 'test@gmail.com'}), content_type='application/json')
            self.assertEqual(response.status_code, 400)
            self.assertEqual(response.json['msg'], 'Password are required')

    def test_signup_with_wrong_email_format(self):
        with app.app_context():
            user = User.find_by_email(self.user_data['email'])
            if user:
                user.delete_from_db()
            response = self.client.post(
                '/api/signup', data=json.dumps({'email': 'testabc.com', 'password': 'password'}), content_type='application/json')
            self.assertEqual(response.status_code, 400)
            self.assertEqual(response.json['msg'], 'Invalid email format')

    def test_signup_already_used_email_user(self):
        with app.app_context():
            user = User.find_by_email(self.user_data['email'])
            if user:
                user.delete_from_db()
            self.client.post(
                '/api/signup', data=json.dumps(self.user_data), content_type='application/json')
            response = self.client.post(
                '/api/signup', data=json.dumps(self.user_data), content_type='application/json')
            self.assertEqual(response.status_code, 409)
            user = User.find_by_email(self.user_data['email'])
            self.assertEqual(response.json['msg'], 'Email already registered')
            self.assertEqual(user.email, self.user_data['email'])
            user.delete_from_db()

    def test_login_valid_user(self):
        with app.app_context():
            user = User.find_by_email(self.user_data['email'])
            if user:
                user.delete_from_db()
            self.client.post(
                '/api/signup', data=json.dumps(self.user_data), content_type='application/json')

            response = self.client.post(
                '/api/login', data=json.dumps(self.user_data), content_type='application/json')
            self.assertEqual(response.status_code, 202)
            assert ('access_token' in response.text)
            user = User.find_by_email(self.user_data['email'])
            user.delete_from_db()

    def test_login_nonexist_user(self):
        response = self.client.post(
            '/api/login', data=json.dumps(self.user_data), content_type='application/json')
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json['msg'], 'Bad username or password')

    def test_get_user_info(self):
        with app.app_context():
            user = User.find_by_email(self.user_data['email'])
            if user:
                user.delete_from_db()
            self.client.post(
                '/api/signup', data=json.dumps(self.user_data), content_type='application/json')

            user = User.find_by_email(self.user_data['email'])
            resp = self.client.get(f'/api/user/{user.id}')
            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.json['email'], self.user_data['email'])
            user.delete_from_db()

    def test_get_nonexist_user_info(self):
        with app.app_context():
            non_exist_uid = '2ce863b4-bc7f-40d7-af46-1280227d4050'
            resp = self.client.get(f'/api/user/{non_exist_uid}')
            self.assertEqual(resp.status_code, 404)
            self.assertEqual(resp.json['msg'], 'User not found')

    def test_update_user_info(self):
        with app.app_context():
            response = self.client.post(
                '/api/login', data=json.dumps(self.exist_user), content_type='application/json')
            access_token = response.json['access_token']
            headers = {
                'Authorization': f'Bearer {access_token}'
            }
            payload = {"new_username": 'realuser', }
            response = self.client.patch('/api/user/update_info', data=json.dumps(
                payload), headers=headers, content_type='application/json')
            self.assertEqual(response.json['msg'], 'Username updated')
            self.assertEqual(response.status_code, 201)

    def test_delete_user(self):
        with app.app_context():
            self.client.post(
                '/api/signup', data=json.dumps(self.user_data), content_type='application/json')
            response = self.client.post(
                '/api/login', data=json.dumps(self.user_data), content_type='application/json')
            access_token = response.json['access_token']
            headers = {
                'Authorization': f'Bearer {access_token}'
            }
            response = self.client.delete(
                '/api/user/delete', headers=headers)
            self.assertEqual(response.status_code, 202)
            self.assertEqual(response.json['msg'], 'Username deleted')
            user = User.find_by_email(self.user_data['email'])
            self.assertEqual(user, None)

    def test_upload_valid_dataset(self):
        with app.app_context():
            # setup user
            response = self.client.post(
                '/api/login', data=json.dumps(self.exist_user), content_type='application/json')
            access_token = response.json['access_token']
            headers = {
                'Authorization': f'Bearer {access_token}'
            }

            with open('tests/test.csv', 'rb') as f:
                file_data = f.read()

            response = self.client.post(
                '/api/dataset/upload',
                headers=headers,
                data={
                    'file': (io.BytesIO(file_data), 'test.csv')
                }
            )
            self.assertEqual(response.status_code, 201)
            self.assertEqual(response.json['msg'],
                             'File uploaded successfully')
            file_id = response.json['file_id']
            ds = Dataset.find_by_did(file_id)
            ds.delete_from_db()

    def test_upload_dataset_with_wrong_extension(self):
        with app.app_context():
            # setup user
            response = self.client.post(
                '/api/login', data=json.dumps(self.exist_user), content_type='application/json')
            access_token = response.json['access_token']
            headers = {
                'Authorization': f'Bearer {access_token}'
            }

            with open('tests/test.txt', 'rb') as f:
                file_data = f.read()

            response = self.client.post(
                '/api/dataset/upload',
                headers=headers,
                data={
                    'file': (io.BytesIO(file_data), 'test.txt')
                }
            )
            self.assertEqual(response.status_code, 400)
            self.assertEqual(response.json['msg'],
                             'File must have .csv extension')

    def test_upload_dataset_without_authorization(self):
        with app.app_context():
            # setup user
            with open('tests/test.csv', 'rb') as f:
                file_data = f.read()

            response = self.client.post(
                '/api/dataset/upload',
                data={
                    'file': (io.BytesIO(file_data), 'test.csv')
                }
            )
            self.assertEqual(response.status_code, 401)
            self.assertEqual(response.json['msg'],
                             'Missing Authorization Header')

    def test_update_dataset_info(self):
        with app.app_context():
            # setup user
            response = self.client.post(
                '/api/login', data=json.dumps(self.exist_user), content_type='application/json')
            access_token = response.json['access_token']
            headers = {
                'Authorization': f'Bearer {access_token}'
            }
            with open('tests/test.csv', 'rb') as f:
                file_data = f.read()

            response = self.client.post(
                '/api/dataset/upload',
                headers=headers,
                data={
                    'file': (io.BytesIO(file_data), 'test.csv')
                }
            )
            file_id = response.json['file_id']
            payload = {
                'title': 'Secret Dataset',
                'is_anonymized': True,
                'topic': 'science'
            }

            response = self.client.patch(f'/api/dataset/update_info/{file_id}', data=json.dumps(
                payload), headers=headers, content_type='application/json')

            self.assertEqual(response.status_code, 201)
            ds = Dataset.find_by_did(file_id)
            self.assertEqual(ds.title, 'Secret Dataset')
            self.assertEqual(ds.is_anonymized, True)
            self.assertEqual(ds.topic, 'science')

            ds.delete_from_db()

    def test_update_other_user_dataset_info(self):
        with app.app_context():
            # setup user
            response = self.client.post(
                '/api/login', data=json.dumps(self.exist_user), content_type='application/json')
            access_token = response.json['access_token']
            headers = {
                'Authorization': f'Bearer {access_token}'
            }

            file_id = '4a6a7355fe'
            payload = {
                'title': 'Secret Dataset',
                'is_anonymized': True,
                'topic': 'science'
            }

            response = self.client.patch(f'/api/dataset/update_info/{file_id}', data=json.dumps(
                payload), headers=headers, content_type='application/json')

            self.assertEqual(response.status_code, 403)
            self.assertEqual(response.json['msg'],
                             'You have no access to this file')

    def test_get_user_dataset(self):
        with app.app_context():
            # setup user
            response = self.client.post(
                '/api/login', data=json.dumps(self.exist_user), content_type='application/json')
            access_token = response.json['access_token']
            headers = {
                'Authorization': f'Bearer {access_token}'
            }
            response = self.client.get("/api/user/datasets", headers=headers)

            self.assertEqual(response.status_code, 200)

    def test_delete_user_dataset(self):
        with app.app_context():
            # setup user
            response = self.client.post(
                '/api/login', data=json.dumps(self.exist_user), content_type='application/json')
            access_token = response.json['access_token']
            headers = {
                'Authorization': f'Bearer {access_token}'
            }

            with open('tests/test.csv', 'rb') as f:
                file_data = f.read()

            response = self.client.post(
                '/api/dataset/upload',
                headers=headers,
                data={
                    'file': (io.BytesIO(file_data), 'test.csv')
                }
            )
            file_id = response.json['file_id']
            response = self.client.delete(
                f'/api/dataset/delete/{file_id}',
                headers=headers
            )
            self.assertEqual(response.status_code, 202)
            self.assertEqual(response.json['msg'],
                             'Dataset deleted')

    def test_delete_other_user_dataset(self):
        with app.app_context():
            # setup user
            response = self.client.post(
                '/api/login', data=json.dumps(self.exist_user), content_type='application/json')
            access_token = response.json['access_token']
            headers = {
                'Authorization': f'Bearer {access_token}'
            }

            file_id = '4a6a7355fe'
            response = self.client.delete(
                f'/api/dataset/delete/{file_id}',
                headers=headers
            )
            self.assertEqual(response.status_code, 403)
            self.assertEqual(response.json['msg'],
                             'You have no access to this file')


if __name__ == '__main__':
    # create test suite
    suite1 = unittest.TestSuite()
    print('- Testsuite for signup/login')
    print('\tTest success creating a valid new user')
    print('\tTest fail creating a user without email')
    print('\tTest fail creating a user without password')
    print('\tTest fail creating a user with wrong email format')
    print('\tTest fail creating a user without already used email')
    print('\tTest success login with a valid user')
    print('\tTest fail login with a nonexist user')

    # add individual tests to the suite
    suite1.addTest(FlaskTest('test_signup_valid_user'))
    suite1.addTest(FlaskTest('test_signup_noemail_user'))
    suite1.addTest(FlaskTest('test_signup_nopassword_user'))
    suite1.addTest(FlaskTest('test_signup_with_wrong_email_format'))
    suite1.addTest(FlaskTest('test_signup_already_used_email_user'))
    suite1.addTest(FlaskTest('test_login_valid_user'))
    suite1.addTest(FlaskTest('test_login_nonexist_user'))
    # run the tests
    runner = unittest.TextTestRunner()
    results = runner.run(suite1)

    # Create the second test suite for other functionality
    suite2 = unittest.TestSuite()
    print('- Testsuite for user manangement')
    print('\tTest success getting user info')
    print('\tTest fail getting user non-exist user info')
    print('\tTest success update user info')
    print('\tTest success delete user')

    suite2.addTest(FlaskTest('test_get_user_info'))
    suite2.addTest(FlaskTest('test_get_nonexist_user_info'))
    suite2.addTest(FlaskTest('test_update_user_info'))
    suite2.addTest(FlaskTest('test_delete_user'))

    # Run the second test suite
    results2 = runner.run(suite2)

    suite3 = unittest.TestSuite()
    print('- Testsuite for dataset manangement')
    print('\tTest success upload a valid dataset')
    print('\tTest fail upload a dataset with wrong file extension')
    print('\tTest fail upload a dataset without authorization')
    print('\tTest success update dataset info')
    print('\tTest fail update dataset info of other user')
    print('\tTest success get list dataset of user')
    print('\tTest success delete user dataset')
    print('\tTest success get list dataset of user')
    print('\tTest success delete dataset of user')
    print('\tTest fail delete dataset of other user')

    suite3.addTest(FlaskTest('test_upload_valid_dataset'))
    suite3.addTest(FlaskTest('test_upload_dataset_with_wrong_extension'))
    suite3.addTest(FlaskTest('test_upload_dataset_without_authorization'))
    suite3.addTest(FlaskTest('test_update_dataset_info'))
    suite3.addTest(FlaskTest('test_update_other_user_dataset_info'))
    suite3.addTest(FlaskTest('test_get_user_dataset'))
    suite3.addTest(FlaskTest('test_delete_user_dataset'))
    suite3.addTest(FlaskTest('test_delete_other_user_dataset'))

    # suite2.addTest(FlaskTest('test_update_user_info'))
    # suite2.addTest(FlaskTest('test_delete_user'))

    # Run the second test suite
    results3 = runner.run(suite3)

    # print information about the test run
    print("Number of tests run:", results.testsRun +
          results2.testsRun + results3.testsRun)
    print("Number of failures:", len(
        results.failures + results2.failures + results3.failures))
    print("Number of errors:", len(
        results.errors + results2.errors + results3.errors))
