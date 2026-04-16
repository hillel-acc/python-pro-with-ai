from tasks import process_data
import time

result = process_data.delay("hello celery and rabbitmq") 

with open("task_id.txt", "w") as f:
    f.write(str(result.id))

