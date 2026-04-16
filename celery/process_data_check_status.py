from celery.result import AsyncResult
from tasks import app


def check_task_status(saved_id):
    res = AsyncResult(saved_id, app=app)
    
    if res.ready():
        if res.successful():
            print(f"Success! Result: {res.result}")
        else:
            print(f"Task failed: {res.result}")
    else:
        print("Task is still pending or running.")


with open("task_id.txt", "r") as f:
    task_id = f.read()
    check_task_status(task_id)
