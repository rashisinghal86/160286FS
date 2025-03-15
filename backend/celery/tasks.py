
from celery import shared_task
import time



@shared_task(ignore_result = False)
def add(x,y):
    time.sleep(10)
    return x+y
    
