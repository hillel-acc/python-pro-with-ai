from celery import Celery
from random import shuffle
import time

# Initialize Celery
# 'pyamqp://' is the protocol for RabbitMQ. 'guest@localhost//' is the default credential.
# 'rpc://' sends the results back as transient AMQP messages.
app = Celery(
    "tasks", broker="redis://localhost:6379/0", backend="redis://localhost:6379/0"
)
#              broker='pyamqp://guest@localhost:5672//',
#              backend='rpc://')


@app.task
def process_data(data_string):
    print(f"Received data: '{data_string}'. Processing...")
    time.sleep(5)  # Simulate a heavy, time-consuming task
    print("Processing complete!")
    return data_string.upper()


WORDS = "the brown dog jumped over the lazy fox".split()


@app.task(bind=True)
def file_writer(self):
    with open(f"out/{self.request.id}", "w") as f:
        for _ in range(1000):
            f.write(" ".join(WORDS) + "\n")
            f.flush()
            time.sleep(1)
            shuffle(WORDS)
