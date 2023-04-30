from redis import Redis
from rq import Queue, Worker
from rq_scheduler import Scheduler
import os

os.environ['RQ_TIMEOUT'] = '3600'

redis_conn = Redis(host='localhost', port=6379)
rq_queue = Queue('supa', connection=redis_conn, default_timeout=3600)
