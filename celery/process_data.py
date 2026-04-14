from tasks import process_data
import time

print("1. Dispatching task to RabbitMQ...")
# .delay() pushes the execution command to the RabbitMQ queue
result = process_data.delay("hello celery and rabbitmq") 

print("2. Task pushed! Moving on with the local script immediately...")
print(f"   Task ID: {result.id}")

while not result.ready():
    print("3. Waiting...")
    time.sleep(1)

print(f"4. Worker finished! The returned result is: {result.get()}")
