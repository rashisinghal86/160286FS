
from celery import shared_task
import time
import flask_excel
from backend.models import Transaction, User
from flask import current_app
# from .mail import send_email
# from .utils import format_report



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


@shared_task(ignore_result = False, name = "download_csv_report")
def csv_report():
    
    return "Initiated CSV Report"
    # transactions = Transaction.query.all() #admin
    # csv_file_name = f"transaction_{datetime.datetime.now().strftime('%Y-%m-%d')}.csv" #transaction_2021-09-01.csv
    # with open(f'static/{csv_file_name}', 'w') as csvfile:
    #     # csvfile = open(f'static/{csv_file_name}', 'w', newline = "")
    #     sr_no = 1
    #     trans_csv = csv.writer(csvfile, delimiter = ',')
    #     trans_csv.writerow(['Sr No', 'Amount', 'Date', 'Description', 'User'])
    #     for transaction in transactions:
    #         this_transaction = [sr_no, transaction.amount, transaction.date, transaction.description, transaction.user.username]
    #         trans_csv.writerow(this_transaction)
    #         sr_no += 1
    # return csv_file_name




@shared_task(ignore_result = False, name = 'monthly_report')
def monthly_report():
    return 'Monthly report sent'
    # users = User.query.all()
    # for user in users[1:]:
    #     user_data ={}
    #     user_data['user'] = user.username
    #     user_data['email'] = user.email
    #     user_transactions = []
    #     for transaction in user.transactions:
    #         this_transaction = {}
    #         this_transaction['amount'] = transaction.amount
    #         this_transaction['date'] = transaction.date
    #         this_transaction['description'] = transaction.description
    #         this_transaction["user"]=transaction.user.username
    #         user_transactions.append(this_transaction)
    #     user_data['transactions'] = user_transactions
    #     message = format_report('templates/mail_report.html', user_data)
    #     send_email(user.email, subject = 'Monthly Transaction Report', message=message)
    


@shared_task(ignore_result = False, name = 'daily_report')
def daily_report():
    # users = User.query.all()
    # for user in users[1:]:
    #     user_data ={}
    #     user_data['user'] = user.username
    #     user_data['email'] = user.email
    #     user_transactions = []
    #     for transaction in user.transactions:
    #         this_transaction = {}
    #         this_transaction['amount'] = transaction.amount
    #         this_transaction['date'] = transaction.date
    #         this_transaction['description'] = transaction.description
    #         this_transaction["user"]=transaction.user.username
    #         user_transactions.append(this_transaction)
    #     user_data['transactions'] = user_transactions
    #     message = format_report('templates/mail_report.html', user_data)
    #     send_email(user.email, subject = 'Daily Transaction Report', message=message)
    return 'Daily report sent'
