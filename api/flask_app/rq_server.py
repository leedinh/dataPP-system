from redis import Redis
from rq import Queue
redis_conn = Redis(host='redis')
rq_queue = Queue('supa', connection=redis_conn, default_timeout=3600)
