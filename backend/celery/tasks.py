
from celery import shared_task
import time
import flask_excel
from backend.models import Transaction
from flask import current_app


@shared_task(ignore_result = False)
def add(x,y):
    time.sleep(10)
    return x+y
    
@shared_task(ignore_result = True)
def create_csv():
    with current_app.app_context():
     
        resource = Transaction.query.all()
        column_names = [column.name for column in Transaction.__table__.columns]
        print(column_names)
        csv_out = flask_excel.make_response_from_query_sets(resource, column_names= column_names, file_type='csv')

        #create a userdownload file and store it in the user downloads folder
        with open('./backend/celery/user-downloads/transactions.csv', 'wb') as file:
            file.write(csv_out.data)

        return 'transactions.csv'
