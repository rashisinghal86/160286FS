from celery import shared_task
import datetime
import csv
from backend.models import User, Schedule, Transaction, Booking, Customer, Professional
from backend.utils import format_report
from backend.mail import send_email
import requests 

#async triggered job on click of button download 
@shared_task(ignore_result=False, name="download_csv_report")
def csv_report():
    users = User.query.all()
    schedules = Schedule.query.all()
    transactions = Transaction.query.all()
    bookings = Booking.query.all()
    customers = Customer.query.all()
    professionals = Professional.query.all()
    csv_file_name = f"service_details_{datetime.datetime.now().strftime('%f')}.csv"
    with open(f'static/{csv_file_name}', 'w' ,newline ="") as csvfile:
        # csvfile = open(f'static/{csv_file_name}', 'w' ,newline ="")
        sr_no = 1
        trans_csv = csv.writer(csvfile, delimiter= ',')
        trans_csv.writerow(["Sr. No.", "Booking ID", "Service Type", "Service Name", "Location", "Customer ID", "Professional ID", "Transaction Amount", "Transaction Status", "Rating", "Reviews"])
        for transaction in transactions:
            for booking in bookings:
                this_trans = [sr_no, booking.id, booking.service.type, booking.service.name, booking.location, transaction.customer_id, transaction.professional_id, transaction.amount, transaction.status, booking.rating, booking.remarks]
                trans_csv.writerow(this_trans)
                sr_no += 1

    return csv_file_name




    print("Downloading CSV report")
    return "CSV report downloaded successfully"

#async scheduled job
@shared_task(ignore_result=False, name="monthly_report")
def monthly_report():
    users = User.query.all()
    for user in users[1:]:
        user_data= {}
        user_data['username'] = user.username
        user_data['email'] = user.email
        user_trans =[]
        transactions = Transaction.query.filter_by(customer_id=user.id).all()
        for t in transactions:
            this_trans = {}
            this_trans['amount'] = t.amount
            this_trans['status'] = t.status
            this_trans['datetime'] = t.datetime
            user_trans.append(this_trans)
        user_data['transactions'] = user_trans
        message = format_report('templates/mail_details.html', user_data)
        send_email(user.email, subject = "Monthly Report", message= message)
    print("Generating monthly report")
    return "Monthly report sent successfully"  

#async triggerd job with webhook. when status of transaction is updated to completed
@shared_task(ignore_result=False, name="daily_reminder") #will be sent to customer only after the booking is completed
def delivery_report(username):
    text = f"Good morning {username}! Thankyou for choosing us. please check the app at http://127.0.0.1:5000/login"
    response = requests.post(
        "https://chat.googleapis.com/v1/spaces/AAAAB51GcLo/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=vbx-B0Kjwr9438S2Q0-WuVHzd6qVshGYhDGz0MJ-aOs",
        headers={"Content-Type": "application/json"},
        json={"text": text},
    )
    print(response.status_code)
    return "Daily reminder sent successfully"

