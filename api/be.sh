#!/bin/sh
docker build -f Dockerfile.postgresql  -t my-postgres .
docker run -d -p 5432:5432 my-postgres

docker build -f Dockerfile.redis  -t my-redis .
docker run -d -p 6379:6379 my-redis

pip install virtualenv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask run --port=5050

