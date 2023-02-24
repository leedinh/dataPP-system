#!/bin/sh
docker build -f Dockerfile.postgresql  -t my-postgres .
docker run -d -p 5432:5432 my-postgres

pip install virtualenv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask run --port=5050

