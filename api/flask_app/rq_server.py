from redis import Redis
from rq import Queue
import os
redis_conn = Redis(host='localhost', port=6379)
rq_queue = Queue('supa', connection=redis_conn, default_timeout=3600)
