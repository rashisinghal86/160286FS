from celery import shared_task
import datetime
import csv
from backend.models import User, Schedule, Transaction, Booking, Customer, Professional

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

@shared_task(ignore_result=False, name="monthly_report")
def monthly_report():
    print("Generating monthly report")
    return "Monthly report generated successfully"  

@shared_task(ignore_result=False, name="daily_reminder")
def daily_reminder():
    print("Sending daily reminder to users")
    return "Daily reminder sent successfully"