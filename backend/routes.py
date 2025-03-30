from app import app
from flask import jsonify, render_template, request, flash, redirect, url_for, session, send_from_directory
from backend.models import db, User, Role,Admin, Professional, Customer, Category, Service, Schedule, Transaction, Booking
from flask_security import login_required, roles_required, current_user, login_user, logout_user, roles_accepted

from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from functools import wraps
from flask_security.utils import verify_and_update_password, login_user
import os
from werkzeug.utils import secure_filename
# from flask_caching import Cache
from celery.result import AsyncResult
from backend.tasks import csv_report, monthly_report, delivery_report

UPLOAD_FOLDER = 'static/uploads'

ALLOWED_EXTENSIONS = {'txt', 'pdf'}
cache = app.cache 

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
    
#----------------------celery tasks---------------------
@app.route('/api/export') #manuallytriggers
def export_csv():
    result = csv_report.delay() 
    return jsonify({'id': result.id,}), 202

@app.route('/api/csv_result/<id>') # just create test result
def csv_result(id):
    res = AsyncResult(id)
    return send_from_directory('static', res.result, as_attachment=True)

@app.route('/api/mail')
def send_reports():
    res = monthly_report.delay()
    return {
        "result": res.result
    }
#----- home page-----
@app.route('/api/users', methods=['GET'])
def get_users():
    """Get a list of all users."""
    users = User.query.all()
    user_list = [{'id': user.id, 'username': user.username, 'email': user.email} for user in users]
    return jsonify(user_list), 200

@app.route('/')
def index(): 
    return render_template('index.html')

@app.route('/cache')
@cache.cached(timeout=5)

def cache():
    return {'time': str(datetime.now())}
@app.route('/protected')
@login_required
def protected():
    return 'protected'

import logging

#-----------------------------login------------------
@app.route('/api/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        # Respond with JSON if already authenticated
        if current_user.is_authenticated:
            return jsonify({
                "message": "You are already logged in.",
                "user": {
                    "id": current_user.id,
                    "username": current_user.username,
                    "email": current_user.email,
                    "role": current_user.role.name  # Fetch dynamic role
                }
            }), 200
        return jsonify({"message": "Please log in to continue."}), 200

    elif request.method == 'POST':
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"error": "Email and password are required."}), 400

        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password, password):
            login_user(user)

            # Store user ID in session
            session['user_id'] = user.id
            session.permanent = True  # Optional: Keeps the session active
            role = Role.query.get(user.role_id)
            print(role)
            print(role.name)
            
            # Ensure user has a role and return it in response
            if not user.roles or len(user.roles) == 0:
                return jsonify({"error": "User has no assigned role!"}), 400
            
            if role.name == 'Professional':
                professional = Professional.query.filter_by(user_id=user.id).first()
                if not professional:
                    return jsonify({'message': 'Professional profile not found', 'redirect_url': url_for('register_pdb')}), 404
                if professional.is_flagged:
                    return jsonify({'message': 'Professional is flagged', 'is_flagged': True}), 403
                if not professional.is_verified:
                    return jsonify({'message': 'Professional is under verification', 'is_verified': False}), 403
                return jsonify({
                    "message": "Login successful!",
                    "professional": {
                        "id": professional.user_id,
                        "name": professional.name,
                        "email": professional.email,
                        "role": "Professional",  # Directly access the first role
                        "is_verified": professional.is_verified,
                        "is_flagged": professional.is_flagged
                    },
                    "authentication_token": user.get_auth_token()  # Generate and return token
                }), 200

            elif role.name == 'Customer':
                customer = Customer.query.filter_by(user_id=user.id).first()
                if customer:
                    if customer.is_blocked:
                        return jsonify({'message': 'Customer is blocked', 'is_blocked': True}), 403
                    return jsonify({
                        "message": "Login successful!",
                        "customer": {
                            "id": customer.user_id,
                            "name": customer.name,
                            "email": customer.email,
                            "role": "Customer",  # Directly access the first role
                            "is_blocked": customer.is_blocked  # Include blocked status
                        },
                        "authentication_token": user.get_auth_token()  # Generate and return token
                    }), 200
                else:
                    return jsonify({'message': 'Customer profile not found', 'redirect_url': url_for('register_cdb')}), 404
            elif role.name == 'Admin':
                admin = Admin.query.filter_by(user_id=user.id).first()
                return jsonify({
                    "message": "Login successful!",
                    "admin": {
                        "id": admin.user_id,
                        "name": admin.name,
                        "role": "Admin"  # Directly access the first role
                    },
                    "authentication_token": user.get_auth_token()  # Generate and return token
                }), 200
        else:
            return jsonify({"error": "Invalid email or password"}), 401           

        
#=================================================================================




@app.route('/api/register', methods=['POST'])
def register():
    # Get JSON data from request
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    # Extract fields from the JSON data
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    confirm_password = data.get('confirm_password')
    role_name = data.get('role')  # Optional: if assigning roles


    # Validate the form data
    if not email or not username or not password or not confirm_password:
        return jsonify({"error": "All fields are required."}), 400

    if password != confirm_password:
        return jsonify({"error": "Passwords do not match."}), 400

    # Check if the email is already registered
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered. Please log in."}), 400
    # Query for the role first
    role = Role.query.filter_by(name=role_name).first()

    if not role:
        return jsonify({"error": "Invalid role selected."}), 400
    # Hash the password and create a new user

    role_id= role.id
    password_hash = generate_password_hash(password)
    user = User(email=email, username=username, password=password_hash,role_id=role_id, active=True)

    # Assign a role to the user if roles exist
    if role_name:
        role = Role.query.filter_by(name=role_name).first()
        if role:
            user.roles.append(role)

    # Add and commit the new user to the database
    db.session.add(user)
    db.session.commit()

    # If the user is assigned the 'Customer' role, create a corresponding entry in the Customer table
    if role_name == 'Customer':
        # You can add logic to get contact information from the request
        customer = Customer(
            user_id=user.id,
            name=username,
            email=email,
            contact= 'N/A',  # You can add logic to get contact information from the request
            location= 'N/A'  # You can add logic to get location from the request
        )
        db.session.add(customer)
        db.session.commit()
        print("Customer committed to DB")
    elif role_name == 'Professional':
        professional = Professional(
            user_id=user.id,
            email=email,
            name=username,
            contact='N/A',  # You can add logic to get contact information from the request
            service_type='N/A',  # You can add logic to get service type from the request
            experience='N/A',  # You can add logic to get experience from the request
            location='N/A',  # You can add logic to get location from the request
            filename='N/A',  # You can add logic to get filename from the request
            is_verified=False,
            is_flagged=False
        )
        db.session.add(professional)
        db.session.commit()
        


    return jsonify({"message": "Registration successful! Please log in."}), 201

#=======================================================================
@app.route('/debug_admin', methods=['GET'])
def debug_admin():
    admin_user = User.query.filter_by(email='admin@example.com').first()
    if not admin_user:
        return "Admin user not found.", 404

    active_status = admin_user.active
    roles = [role.name for role in admin_user.roles]

    return {
        "email": admin_user.email,
        "active": active_status,
        "roles": roles
    }

@app.route('/debug_password', methods=['GET'])
def debug_password():
    from werkzeug.security import check_password_hash

    admin_user = User.query.filter_by(email='admin@example.com').first()
    if not admin_user:
        return "Admin user not found.", 404

    is_password_correct = check_password_hash(admin_user.password, 'admin123!@#')
    return {
        "email": admin_user.email,
        "password_correct": is_password_correct
    }

from flask import request
from flask_security.utils import verify_and_update_password

@app.route('/test_login', methods=['POST'])
def test_login():
    # Debugging: Check incoming JSON data
    print("Request JSON data:", request.json)
    
    # Extract data from JSON body
    email = request.json.get('email')
    password = request.json.get('password')

    # Validate user credentials
    user = User.query.filter_by(email=email).first()
    if user and verify_and_update_password(password, user):
        return {"success": True, "message": "Login successful"}
    return {"success": False, "message": "Invalid credentials"}

@app.route('/admin')
@login_required
@roles_required('admin')
def admin_dashboard():
    return "Admin Dashboard"
from flask_security import current_user

@app.route('/debug_roles')
def debug_roles():
    return {"roles": [role.name for role in current_user.roles]}


 
@app.route('/home')
@login_required
@roles_accepted('Professional', 'Customer')
def home():
    print(f"Current User: {current_user}")  # Debugging step
    print(f"User Roles: {current_user.roles}")  # Debugging step

    # Check if the user has a role before accessing `role.name`
    if current_user.roles:
        for role in current_user.roles:
            print(f"Role: {role.name}")  # Debugging step
            if role.name == 'Admin':
                return jsonify({"message": "Welcome, Admin!"})
    else:
        print("User has no roles assigned!")  # Debugging step

    return jsonify({"message": "Welcome to Home Page!"})

# #--1. registering a user-----------------------------------

@app.route('/api/register_professional', methods=['POST'])
def register_professional():
    if 'user_id' not in session:
        return jsonify({'error': 'User not logged in'}), 401  

    user = User.query.get(session['user_id'])  
    """API to register a professional."""
    data = request.get_json()  
    
    if not data:
        return jsonify({"error": "Invalid request, JSON data required"}), 400

    email = data.get('email')
    name = data.get('name')
    contact = data.get('contact')
    service_type = data.get('service_type')
    experience = data.get('experience')
    location = data.get('location')
    
    if not email or not name or not contact or not service_type or not experience:
        return jsonify({"error": "Please enter all required fields"}), 400

    user = User.query.get(session['user_id'])  

    existing_professional = Professional.query.filter_by(user_id=user.id).first()
    if existing_professional:
        return jsonify({"message": "Already registered", "redirect": "/api/professional_dashboard"}), 200

    # Create new professional entry
    new_professional = Professional(
        user_id=user.id,
        email=email,
        name=name,
        contact=contact,
        service_type=service_type,
        experience=experience,
        location=location
    )
    
    db.session.add(new_professional)
    db.session.commit()

    return jsonify({"message": "Professional registered successfully", "redirect": "/api/professional_dashboard"}), 201


@app.route('/api/upload_professional_file', methods=['POST'])
def upload_professional_file():
    """API for handling professional document uploads."""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type'}), 400

        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        return jsonify({'message': 'File uploaded successfully'}), 200

    except Exception as e:
        print("Error:", str(e))  
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500


#---------admin prof management routes-------------------
#search
@app.route('/api/admin/professionals', methods=['GET'])
@login_required
@roles_required('Admin')  
def professionals():
    pname = request.args.get('pname') or ''
    pservice_type = request.args.get('pservice_type') or ''
    plocation = request.args.get('plocation') or ''

    query = Professional.query

    if pname:
        query = query.filter(Professional.name.ilike(f'%{pname}%'))
    if pservice_type:
        query = query.filter(Professional.service_type.ilike(f'%{pservice_type}%'))
    if plocation:
        query = query.filter(Professional.location.ilike(f'%{plocation}%'))

    professionals = Professional.query.all()

    professionals_list = [{
        'id': professional.id,
        'name': professional.name,
        'service_type': professional.service_type,
        'location': professional.location,
        'filename': professional.filename,
         'is_verified': professional.is_verified,
         'is_flagged': professional.is_flagged 
    } for professional in professionals]

    return jsonify({
        'professionals': professionals_list,
        'filters': {
            'pname': pname,
            'pservice_type': pservice_type,
            'plocation': plocation
        }
    }), 200


@app.route('/api/admin/pending_professionals', methods=['GET'])
@roles_required('Admin')
@login_required
def pending_professionals():
    if current_user.role_id != 1:
        return jsonify({"message": "Forbidden, you must be an admin."}), 403
 
    # Fetch professionals based on verification status and flagging
    pending_professionals = Professional.query.filter_by(is_verified=False, is_flagged=False).all()
    approved_professionals = Professional.query.filter_by(is_verified=True).all()
    blocked_professionals = Professional.query.filter_by(is_flagged=True).all()

    pending_list = [{'id': prof.id, 'name': prof.name, 'service_type': prof.service_type, 
                     'location': prof.location, 'experience': prof.experience, 'filename': prof.filename} 
                    for prof in pending_professionals]

    approved_list = [{'id': prof.id, 'name': prof.name, 'service_type': prof.service_type, 
                      'location': prof.location, 'experience': prof.experience} 
                     for prof in approved_professionals]

    blocked_list = [{'id': prof.id, 'name': prof.name, 'service_type': prof.service_type, 
                     'location': prof.location, 'experience': prof.experience} 
                    for prof in blocked_professionals]

    return jsonify({
        'pending_professionals': pending_list,
        'approved_professionals': approved_list,
        'blocked_professionals': blocked_list
    }), 200

@app.route('/api/admin/approve_professional/<int:id>', methods=['POST'])
@login_required
@roles_required('Admin')
def approve_professional(id):
    """API endpoint to approve a professional"""
    try:
        professional = Professional.query.get(id)
        if not professional:
            return jsonify({'error': 'Professional not found'}), 404

        professional.is_verified = True
        db.session.commit()

        return jsonify({'message': 'Professional approved successfully'}), 200

    except Exception as e:
        print("Error:", str(e))  # Log error to console
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500


@app.route('/api/admin/block_professional/<int:id>', methods=['POST'])
@login_required
@roles_required('Admin')
def block_professional(id):
    professional = Professional.query.get(id)
    if not professional:
        return jsonify({'error': 'Professional not found'}), 404

    # Block the professional
    professional.is_flagged = True
    professional.is_verified = False
    db.session.commit()

    return jsonify({
        'message': f'Professional {professional.name} blocked successfully',
        'professional_id': professional.id,
        'is_flagged': professional.is_flagged,
        'is_verified': professional.is_verified
    }), 200


@app.route('/api/admin/unblock_professional/<int:id>', methods=['POST'])
@login_required
@roles_required('Admin')
def unblock_professional(id):
    professional = Professional.query.get(id)
    if not professional:
        return jsonify({'error': 'Professional not found'}), 404

    professional.is_flagged = False
    db.session.commit()

    return jsonify({
        'message': f'Professional {professional.name} unblocked successfully',
        'professional_id': professional.id,
        'status': 'unblocked'
    }), 200
 #-------------------------------------------------#   




# #---2b customer registration-----------------------------------

# @app.route('/register_cdb')
# def register_cdb():
#     return render_template('register_cdb.html')


# @app.route('/register_cdb', methods=['POST'])
# def register_cdb_post():
    
#     user = User.query.get(session['user_id'])
#     customer = Customer.query.filter_by(user_id=user.id).first()
#     if customer:
#         #return ('already registered customer page' )
#         return redirect(url_for('cust_db', name=customer.users.name))
    
#     email = request.form['email']
#     name = request.form['name']
#     #username = request.form['username']
#     contact = request.form['contact']
#     location = request.form['location']
#     password = request.form['password']
    
#     if not email or not name or not contact or not location or not password:
#         flash('Please enter all the fields')
#         return redirect(url_for('register_cdb'))
    
#     new_customer = Customer(user_id=user.id, email=email, name=name, contact=contact, location=location)
#     db.session.add(new_customer)
#     db.session.commit()
    
#     #Check if customer-specific details are already provided\    
#     flash('Customer registered successfully')
#     return redirect(url_for('cust_db'))
@app.route('/api/register_cdb', methods=['GET'])
def register_cdb():
    """Fetch current registration details, if applicable."""
    # If you need any specific data to be sent with the GET request, you can return here
    return jsonify({'message': 'Register your customer details using POST'}), 200


@app.route('/api/register_cdb', methods=['POST'])
def register_cdb_post():
    """Register a new customer."""
    user = User.query.get(current_user.id)
    
    # Check if the user has already registered as a customer
    customer = Customer.query.filter_by(user_id=user.id).first()
    if customer:
        return jsonify({
            'message': 'Already registered as a customer',
            'customer_name': customer.name,
            'redirect_to': f"/api/cust_db/{customer.id}"
        }), 400  # Bad Request, since they already exist

    # Extracting data from the request body
    data = request.get_json()

    email = data.get('email')
    name = data.get('name')
    contact = data.get('contact')
    location = data.get('location')
    password = data.get('password')

    if not email or not name or not contact or not location or not password:
        return jsonify({'error': 'Please enter all the fields'}), 400

    # Register the new customer
    new_customer = Customer(user_id=user.id, email=email, name=name, contact=contact, location=location)
    db.session.add(new_customer)
    db.session.commit()

    # Success response
    return jsonify({
        'message': 'Customer registered successfully',
        'customer_name': new_customer.name,
        'customer_email': new_customer.email
    }), 201  # HTTP status code for Created

# #Admin route to search customers and blocked/unblocked.
@app.route('/api/admin/customers', methods=['GET'])
@login_required
@roles_required('Admin')
def get_customers():


    # if not current_user.is_authenticated or current_user.role.name != 'Admin':
    #     return jsonify({'error': 'Unauthorized access'}), 403  

    # Get the query parameters for filtering customers
    cname = request.args.get('cname', '')  # Default to empty string if not provided
    clocation = request.args.get('clocation', '')  # Default to empty string if not provided

    # Fetch the customers based on filtering criteria
    customers = Customer.query.all()
    
    # Filter based on customer name and location if provided
    if cname:
        customers = Customer.query.filter(Customer.name.ilike(f'%{cname}%')).all()
    if clocation:
        customers = [customer for customer in customers if customer.location and clocation.lower() in customer.location.lower()]

    # Prepare the response data
    customer_list = [{
        'id': customer.id,
        'name': customer.name,
        'location': customer.location,
        'is_blocked': customer.is_blocked

    } for customer in customers]

    return jsonify(customer_list), 200


@app.route('/api/admin/manage_customers', methods=['GET'])
@login_required
@roles_required('Admin')
def manage_customers():
    unblocked_customers = Customer.query.filter_by(is_blocked=False).all()
    blocked_customers = Customer.query.filter_by(is_blocked=True).all()

    unblocked_customers_data = [
        {
            'id': customer.id,
            'name': customer.name,
            'location': customer.location
        }
        for customer in unblocked_customers
    ]

    blocked_customers_data = [
        {
            'id': customer.id,
            'name': customer.name,
            'location': customer.location
        }
        for customer in blocked_customers
    ]

    return jsonify({
        'unblocked_customers': unblocked_customers_data,
        'blocked_customers': blocked_customers_data
    }), 200

# # Admin route to unblock customer
@app.route('/api/admin/unblock_customer/<int:id>', methods=['POST'])
@login_required
@roles_required('Admin')
def api_unblock_customer(id):
    customer = Customer.query.get(id)
    
    if not customer:
        return jsonify({'error': 'Customer not found'}), 404
    
    customer.is_blocked = False
    db.session.commit()
    
    return jsonify({'message': f'Customer {customer.name} unblocked successfully'}), 200


# # Admin route to block customer
@app.route('/api/admin/block_customer/<int:id>', methods=['POST'])
@login_required
@roles_required('Admin')
def block_customer(id):   
    customer = Customer.query.get(id)
    
    if not customer:
        return jsonify({"error": "Customer not found"}), 404

    customer.is_blocked = True
    db.session.commit()
    
    return jsonify({"message": f"Customer {customer.name} blocked successfully"}), 200


@app.route('/api/admin/delete_customer/<int:id>', methods=['DELETE'])
def delete_customer(id):
    customer = Customer.query.get(id)
    if not customer:
        return jsonify({'error': 'Customer not found'}), 404

    # Get the user associated with the customer
    user = User.query.filter_by(id=customer.user_id).first()

    # Delete the customer entry
    db.session.delete(customer)

    # Delete the corresponding user entry if found
    if user:
        db.session.delete(user)

    db.session.commit()

    return jsonify({
        'message': f'Customer {id} and associated user deleted successfully',
        'customer_id': id,
        'user_id': user.id if user else None
    }), 200

# # ------------------------------------------------------------------------#  

# @app.route('/prof_db')
# def prof_db():
#     prof_name = request.args.get('username') or ''
    
    
#     return render_template('prof_db.html', prof_name=prof_name)
    

# @app.route('/prof_db/<int:id>')
# def prof_db_post(id):
#     booking = Booking.query.get(id)
#     pending_booking = Booking.query.filter_by(is_pending=True).all()

#     if not booking:
#         flash('Booking does not exist')
#         return redirect(url_for('prof_db'))
    
#     booking.is_pending = False
#     booking.is_accepted = True

#     booking.professional_id = Professional.query.filter_by(user_id=session['user_id']).first().id
    


#     db.session.commit()
#     flash('Booking accepted successfully')
    
#     return redirect(url_for('prof_db',booking=booking,pending_booking=pending_booking))

@app.route('/api/prof_db', methods=['GET'])
def get_prof_dashboard():
    """Fetch professional dashboard details"""
    prof_name = request.args.get('username') or ''

    return jsonify({"prof_name": prof_name}), 200


@app.route('/api/prof_db/<int:id>', methods=['POST'])
def accept_booking(id):
    """Accept a pending booking"""
    booking = Booking.query.get(id)
    
    if not booking:
        return jsonify({"message": "Booking does not exist"}), 404

    if not booking.is_pending:
        return jsonify({"message": "Booking is not pending"}), 400

    # Update booking status
    booking.is_pending = False
    booking.is_accepted = True

    professional = Professional.query.filter_by(user_id=session.get('user_id')).first()
    
    if not professional:
        return jsonify({"message": "Professional not found"}), 403

    booking.professional_id = professional.id

    db.session.commit()

    return jsonify({"message": "Booking accepted successfully", "booking_id": booking.id}), 200

# #-----3. signout-------------------------

@app.route('/api/signout', methods=['POST'])

def signout():
    if not current_user.is_authenticated:
        return jsonify({'error': 'User not logged in'}), 401

    logout_user()
    session.clear()
    return jsonify({'message': 'Successfully signed out'}), 200

@app.route('/api/admin/delete_professional/<int:id>', methods=['DELETE'])
@login_required
@roles_required('Admin')
def delete_professional(id):
    professional = Professional.query.get(id)
    if not professional:
        return jsonify({'error': 'Professional not found'}), 404

    # Get the user associated with the professional
    user = User.query.filter_by(id=professional.user_id).first()

    # Delete the professional entry
    db.session.delete(professional)

    # Delete the corresponding user entry if found
    if user:
        db.session.delete(user)

    db.session.commit()

    return jsonify({
        'message': f'Professional {id} and associated user deleted successfully',
        'professional_id': id,
        'user_id': user.id if user else None
    }), 200

# @app.route('/delete/cust')
# @login_required
# def delete_cust():
#     user = User.query.get(session['user_id'])

#     if user:
#         customer = Customer.query.filter_by(user_id=user.id).first()
#         if customer:
#             db.session.delete(customer)
        
#         db.session.delete(user)
#         db.session.commit()
#     else:
#         print("User not found.")

#     return render_template('homecss.html')
@app.route('/api/delete/prof', methods=['DELETE'])
@login_required
def delete_prof():
    """Delete the currently authenticated professional account."""
    # Fetch the user from the session
    user = User.query.get(session.get('user_id'))

    if not user:
        return jsonify({'message': 'User not found', 'status': 'error'}), 404

    # Fetch the professional associated with the user
    professional = Professional.query.filter_by(user_id=user.id).first()

    try:
        # Delete the professional record if it exists
        if professional:
            db.session.delete(professional)

        # Delete the user record
        db.session.delete(user)
        db.session.commit()

        return jsonify({'message': 'Professional account deleted successfully', 'status': 'success'}), 200

    except Exception as e:
        # Rollback in case of an error
        db.session.rollback()
        return jsonify({'message': 'Failed to delete account', 'error': str(e)}), 500
    
@app.route('/api/delete/cust', methods=['DELETE'])
@login_required
def delete_cust():
    """Delete the currently authenticated customer account."""
    user = User.query.get(session.get('user_id'))  # Ensure session has user_id

    if not user:
        return jsonify({'message': 'User not found', 'status': 'error'}), 404

    customer = Customer.query.filter_by(user_id=user.id).first()

    try:
        if customer:
            db.session.delete(customer)  # Delete customer record
        
        db.session.delete(user)
         # Delete user record
        db.session.commit()
        
        return jsonify({'message': 'Account deleted successfully', 'status': 'success'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to delete account', 'error': str(e)}), 500


#@app.route('/api/users', methods=['GET'])
@roles_required('admin')
def get_users():
    """Retrieve all users, professionals, and customers."""
    users = User.query.all()
    admin = Admin.query.all()
    professionals = Professional.query.all()
    customers = Customer.query.all()

    if not users:
        return jsonify({"message": "No users found"}), 404

    users_data = [
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": Role.query.get(user.role_id).name if user.role_id else None
        }
        for user in users
    ]
    admin_data = [
        {"id": a.id, "name": a.name, "email": a.users.email} for a in admin
    ]
    professionals_data = [
        {"id": p.id, "name": p.name, "email": p.users.email} for p in professionals
    ]

    customers_data = [
        {"id": c.id, "name": c.name, "email": c.users.email} for c in customers
    ]

    return jsonify({
        "users": users_data,
        "admin": admin_data,
        "professionals": professionals_data,
        "customers": customers_data
    }), 200

# @app.route('/delete/user/post', methods=['POST'])
# @roles_required('admin')
# def delete_user_post():
#     id = request.form.get('id')
#     # username=request.form.get('username')
#     user = User.query.filter_by(id=id).first()    
#     if not user:
#         flash('User does not exist')      
#     prof=Professional.query.filter_by(user_id=user.id).first()
#     if prof:
#         db.session.delete(prof)
#     cust=Customer.query.filter_by(user_id=user.id).first()
#     if cust:
#         db.session.delete(cust)
    
#     db.session.delete(user)
#     db.session.commit()
#     flash('User deleted successfully')
#     return redirect(url_for('delete_user'))

@app.route('/api/delete/user', methods=['POST'])
# @roles_required('admin')  # Uncomment if role-based access is needed
def delete_user():
    data = request.get_json()  # Get JSON data from request
    user_id = data.get('id')

    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400

    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User does not exist'}), 404

    # Check and delete associated professional or customer
    prof = Professional.query.filter_by(user_id=user.id).first()
    if prof:
        db.session.delete(prof)

    cust = Customer.query.filter_by(user_id=user.id).first()
    if cust:
        db.session.delete(cust)

    db.session.delete(user)
    db.session.commit()

    return jsonify({'message': 'User deleted successfully'}), 200


           

            


@app.route('/api/profile', methods=['GET']) #not using this for now

@login_required
def profile():
    user = User.query.get(session.get('user_id'))
    # print("User ID in session:", session.get('user_id'))
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    role = Role.query.get(user.role_id)
    if not role:
        return jsonify({"message": "Role not found"}), 404

    profile_data = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": role.name
    }

    if role.name == 'Professional':
        professional = Professional.query.filter_by(user_id=user.id).first()
        if professional:
            profile_data["name"] = professional.name
            profile_data["experience"] = professional.experience
            profile_data["service_type"] = professional.service_type

    elif role.name == 'Customer':
        customer = Customer.query.filter_by(user_id=user.id).first()
        if customer:
            profile_data["name"] = customer.name
            profile_data["location"] = customer.location

    elif role.name == 'Admin':
        admin = Admin.query.filter_by(user_id=user.id).first()
        if admin:
            profile_data["name"] = admin.name

    return jsonify(profile_data), 200

@app.route('/api/profile', methods=['POST'])
def profile_post():
    """API endpoint to update user profile"""
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized access'}), 401

    user = User.query.get(session['user_id'])
    if not user:
        return jsonify({'error': 'User not found'}), 404

    role = Role.query.get(user.role_id)
    if not role:
        return jsonify({'error': 'Role not found'}), 404

    data = request.json  # Extract JSON data from the request
    # print(data)
    # Extract common fields
    username = data.get('username')
    cpassword = data.get('cpassword')
    password = data.get('password')

    # print(username, cpassword, password)

    if not username or not cpassword or not password:
        return jsonify({'error': 'Please fill out all required fields'}), 400

    # Validate current password
    if not check_password_hash(user.password, cpassword):
        return jsonify({'error': 'Incorrect current password'}), 403

    # Check if the new username is already taken
    if username != user.username:
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return jsonify({'error': 'Username already exists'}), 409

    # Hash the new password
    new_password_hash = generate_password_hash(password)
    user.username = username
    user.password = new_password_hash

    # Role-specific updates
    if role.name == 'Admin':
        print(role.name)
        admin = Admin.query.filter_by(user_id=user.id).first()
        if not admin:
            return jsonify({'error': 'Admin profile not found'}), 404
        admin.name = data.get('name', admin.name)
        user.name = admin.name

    elif role.name == 'Professional':
        professional = Professional.query.filter_by(user_id=user.id).first()
        if not professional:
            return jsonify({'error': 'Professional profile not found'}), 404
        professional.email = data.get('email', professional.email)
        professional.name = data.get('name', professional.name)
        professional.contact = data.get('contact', professional.contact)
        professional.location = data.get('location', professional.location)
        professional.experience = data.get('experience', professional.experience)
        user.name = professional.name
        professional.service_type = data.get('service_type', professional.service_type)

    elif role.name == 'Customer':
        customer = Customer.query.filter_by(user_id=user.id).first()
        if not customer:
            return jsonify({'error': 'Customer profile not found'}), 404
        customer.email = data.get('email', customer.email)
        customer.name = data.get('name', customer.name)
        customer.contact = data.get('contact', customer.contact)
        customer.location = data.get('location', customer.location)
        user.name = customer.name

    else:
        return jsonify({'error': 'Unexpected role. Please contact support.'}), 400

    db.session.commit()
    return jsonify({'message': 'Profile updated successfully'}), 200






    
#-------admin pages-----------------------------------
@app.route('/api/admin_db', methods=['GET'])
@login_required
def admin_db():
    # ✅ Check if the logged-in user has the 'admin' role
    # ✅ Check if the logged-in user has role_id 1
    if current_user.role_id != 1:  
        return jsonify({"error": "Forbidden: Admin access required"}), 403
 

    admin = Admin.query.filter_by(user_id=current_user.id).first()
    if not admin:
        return jsonify({"error": "Admin not found"}), 404

    categories = Category.query.all()
    category_data = [
        {
            "name": category.name,
            "service_count": len(category.services)
        } 
        for category in categories
    ]

    pending_professionals = Professional.query.filter_by(is_verified=False).count()
    blocked_professionals = Professional.query.filter_by(is_flagged=True).count()
    approved_professionals = Professional.query.filter_by(is_verified=True).count()
    
    blocked_customers = Customer.query.filter_by(is_blocked=True).count()
    unblocked_customers = Customer.query.filter_by(is_blocked=False).count()

    return jsonify({
        
        "admin": {
            "id": admin.id,
            "username": admin.user.username
        },
        "categories": category_data,
        "professional_counts": {
            "pending": pending_professionals,
            "blocked": blocked_professionals,
            "approved": approved_professionals
        },
        "customer_counts": {
            "blocked": blocked_customers,
            "unblocked": unblocked_customers
        }
    }), 200

# #----------------Add category pages-----------------------------------

# Create a New Category 
@app.route('/api/category', methods=['POST'])
@login_required
@roles_required('Admin')
def add_category():
    data = request.get_json()
    name = data.get('name')

    if not name:
        return jsonify({'error': 'Please provide a category name'}), 400

    category = Category(name=name)
    db.session.add(category)
    db.session.commit()

    return jsonify({
        'message': 'Service_Type added successfully',
        'category_id': category.id
    }), 201

# get  Category by ID

@app.route('/api/category/<int:id>', methods=['GET'])
@login_required
@roles_required('Admin')
def get_category(id):
    category = Category.query.get(id)
    if not category:
        return jsonify({'error': 'Service_Type does not exist'}), 404

    return jsonify({
        'id': category.id,
        'name': category.name,
    }), 200

#all categories fetch 
@app.route('/api/category', methods=['GET'])
@login_required
@roles_required('Admin')
def get_categories():
    categories = Category.query.all()
    print(categories)
    if not categories:
        return jsonify({'error': 'Service_Type does not exist'}), 404
    categories_list = []
    for category in categories:
        categories_list.append({
            'id': category.id,
            'name': category.name,
        })
    
    return jsonify(categories_list), 200


@app.route('/api/category/<int:id>', methods=['PUT'])
@login_required
@roles_required('Admin')
def update_category(id):
    category = Category.query.get(id)
    if not category:
        return jsonify({'error': 'Service_Type does not exist'}), 404

    data = request.get_json()
    name = data.get('name')

    if not name:
        return jsonify({'error': 'Please provide a category name'}), 400

    category.name = name
    db.session.commit()
    return jsonify({'message': 'Service_Type updated successfully'}), 200


@app.route('/api/category/<int:id>', methods=['DELETE'])
@login_required
@roles_required('Admin')
def delete_category(id):
    category = Category.query.get(id)
    if not category:
        return jsonify({'error': 'Service_Type does not exist'}), 404

    db.session.delete(category)
    db.session.commit()

    return jsonify({'message': 'Service_Type deleted successfully'}), 200



# #----------- Add services in a category-----------------------------------
@app.route('/api/categories/<int:category_id>/services', methods=['POST'])
@login_required
@roles_required('Admin')
def create_service(category_id):
    category = Category.query.get_or_404(category_id)
    data = request.get_json()
    new_service = Service(
        category_id=category.id,
        name=data['name'],
        type=data['type'],
        description=data['description'],
        price=data['price'],
        location=data['location'],
        duration=data['duration']
    )
    db.session.add(new_service)
    db.session.commit()
    return jsonify({'message': 'Service created successfully', 'service_id': new_service.id}), 201


@app.route('/api/categories/<int:category_id>/services', methods=['GET'])
@login_required
@roles_required('Admin')

def get_services_by_category(category_id):
    category = Category.query.get(category_id)
    if not category:
        return jsonify({'error': 'Category does not exist'}), 404
    
    services = Service.query.filter_by(category_id=category_id).all()
    
    return jsonify({
        'category': {'id': category.id, 'name': category.name},
        'services': [
            {
                'id': service.id,
                'name': service.name,
                'type': service.type,
                'description': service.description,
                'price': service.price,
                'location': service.location,
                'duration': service.duration
            }
            for service in services
        ]
    }), 200

@app.route('/api/categories/<int:category_id>/services/<int:service_id>', methods=['GET'])
@login_required
@roles_required('Admin')
def get_service(category_id, service_id):
    service = Service.query.filter_by(id=service_id, category_id=category_id).first_or_404()
    return jsonify({
        'id': service.id,
        'name': service.name,
        'type': service.type,
        'description': service.description,
        'price': service.price,
        'location': service.location,
        'duration': service.duration
    }), 200

@app.route('/api/categories/<int:category_id>/services/<int:service_id>', methods=['PUT'])
@login_required
@roles_required('Admin')
def update_service(category_id, service_id):
    service = Service.query.filter_by(id=service_id, category_id=category_id).first_or_404()
    data = request.get_json()
    service.name = data.get('name', service.name)
    service.type = data.get('type', service.type)
    service.description = data.get('description', service.description)
    service.price = data.get('price', service.price)
    service.location = data.get('location', service.location)
    service.duration = data.get('duration', service.duration)
    db.session.commit()
    return jsonify({'message': 'Service updated successfully'}), 200

@app.route('/api/categories/<int:category_id>/services/<int:service_id>', methods=['DELETE'])
@login_required
@roles_required('Admin')
def delete_service(category_id, service_id):
    service = Service.query.filter_by(id=service_id, category_id=category_id).first_or_404()
    db.session.delete(service)
    db.session.commit()
    return jsonify({'message': 'Service deleted successfully'}), 200

# #-----------------professional pages-----------------------------------

# # @app.route('/applybook')
# # def applybook():
# #     categories=Category.query.all()
# #     category_names = [category.name for category in categories]
# #     category_sizes = [len(category.services) for category in categories]

# #     return render_template('applybook.html', categories=categories, category_names=category_names, category_sizes=category_sizes)

# # -----------user-pages-----------------------------------
# @app.route('/cust_db')
# def cust_db():
#     cust_name = request.args.get('username') or ''
#     return render_template('cust_db.html', cust_name=cust_name)
@app.route('/cust_db/<int:user_id>')
def cust_db(user_id):
    customer = Customer.query.filter_by(user_id=user_id).first()
    if not customer:
        return jsonify({'message': 'Customer not found'}), 404
    return render_template('cust_db.html', customer=customer)

@app.route('/api/cust_db/<int:user_id>', methods=['GET'])
def api_cust_db(user_id):
    customer = Customer.query.filter_by(user_id=user_id).first()
    if not customer:
        return jsonify({'message': 'Customer not found'}), 404
    customer_data = {
        'id': customer.id,
        'name': customer.name,
        'email': customer.email,
        'contact': customer.contact,
        'location': customer.location,
        'is_blocked': customer.is_blocked
    }
    return jsonify({'customer': customer_data}), 200


@app.route('/api/catalogue', methods=['GET'])
@login_required
@roles_required('Customer')
def get_catalogue():
    """Fetch categories and services based on filters."""

    if 'user_id' not in session:
        return jsonify({"error": "Unauthorized access"}), 401

    # Get query parameters
    cname = request.args.get('cname', '').strip()
    sname = request.args.get('sname', '').strip()
    location = request.args.get('location', '').strip()

    # Start with Category query (ensures categories without services are included)
    query = db.session.query(Category).outerjoin(Service).distinct()

    if cname:
        query = query.filter(Category.name.ilike(f'%{cname}%'))
    
    if sname:
        query = query.filter(Service.name.ilike(f'%{sname}%'))
    
    if location:
        query = query.filter(Service.location.ilike(f'%{location}%'))

    categories = query.all()

    #  categories appear even if no services match

    categories_data = []
    for cat in categories:
        services = [
            {
                "id": service.id,
                "name": service.name,
                "price": service.price,
                "description": service.description,
                "location": service.location,
            }
            for service in cat.services
            if (not sname or sname.lower() in service.name.lower()) and
               (not location or location.lower() in service.location.lower())
        ]

        # Include category even if no services match
        categories_data.append({
            "id": cat.id,
            "name": cat.name,
            "services": services
        })

    return jsonify({"categories": categories_data}), 200


@app.route('/add_to_schedule/<int:service_id>', methods=['POST'])
@login_required
def add_to_schedule(service_id):
    service = Service.query.get(service_id)
    if not service:
        return jsonify({'error': 'Service does not exist'}), 404

    data = request.get_json()
    location = data.get('location')
    schedule_datetime_str = data.get('schedule_datetime')

    if not location:
        return jsonify({'error': 'Please enter location'}), 400

    if not schedule_datetime_str:
        return jsonify({'error': 'Schedule date and time are required'}), 400

    try:
        schedule_datetime = datetime.strptime(schedule_datetime_str, '%Y-%m-%dT%H:%M')
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DDTHH:MM'}), 400

    if schedule_datetime < datetime.now():
        return jsonify({'error': 'Date & booking cannot be in the past'}), 400

    # Check if a schedule already exists for this service at the same time
    existing_schedule = Schedule.query.filter_by(service_id=service_id, schedule_datetime=schedule_datetime).first()
    if existing_schedule:
        return jsonify({'error': 'Service already scheduled at this time'}), 409

    # Create a new schedule entry
    new_schedule = Schedule(
        customer_id=session.get('user_id'), 
        service_id=service_id, 
        schedule_datetime=schedule_datetime, 
        location=location,
        is_pending=True,
        is_active=True,
        is_accepted=False,
        is_cancelled=False,
        is_completed=False
    )

    db.session.add(new_schedule)
    db.session.commit()

    return jsonify({'message': 'Service added to schedule successfully', 'schedule_id': new_schedule.id}), 201







# # ------------------------backend.routes from cust_db--------------------
@app.route('/api/schedules', methods=['GET'])
@login_required
def get_schedules():
    user = User.query.get(session['user_id'])
    role_id = user.role_id

    if role_id == 2:  # Professional
        professional = Professional.query.filter_by(user_id=session['user_id']).first()
        if not professional:
            return jsonify({'error': 'Professional does not exist'}), 404

        schedules = Schedule.query.join(Service).join(Category).filter(Category.name == professional.service_type).all()
    elif role_id == 3:  # Customer
        customer = Customer.query.filter_by(user_id=session['user_id']).first()
        if not customer:
            return jsonify({'error': 'Customer does not exist'}), 404

        schedules = Schedule.query.filter_by(customer_id=session['user_id']).all()
    else:
        return jsonify({'error': 'You are not authorized to access this page'}), 403

    schedules_data = [
        {
            'id': schedule.id,
            'service': {
                'name': schedule.service.name,
                'price': schedule.service.price
            },
            'location': schedule.location,
            'schedule_datetime': schedule.schedule_datetime
        }
        for schedule in schedules
    ]
    return jsonify(schedules_data), 200

@app.route('/api/schedule/<int:service_id>', methods=['POST'])
@login_required
def schedule_service(service_id):
    user = User.query.get(session['user_id'])
    role_id = user.role_id

    if role_id != 3:  # Only customers can schedule services
        return jsonify({'error': 'You are not authorized to schedule services'}), 403

    data = request.get_json()
    datetime_str = data.get('datetime')
    location = 'location'  # data.get('location')

    try:
        schedule_datetime = datetime.strptime(datetime_str, '%Y-%m-%dT%H:%M')
    except ValueError:
        return jsonify({'error': 'Invalid date format'}), 400

    if schedule_datetime < datetime.now():
        return jsonify({'error': 'Date & booking cannot be in the past'}), 400

    schedule = Schedule(
        service_id=service_id,
        customer_id=user.id,
        professional_id=None,
        schedule_datetime=schedule_datetime,
        location=location,
        is_pending=True,
        is_accepted=False,
        is_cancelled=False,
        is_completed=False
    )

    db.session.add(schedule)
    db.session.commit()

    return jsonify({'message': 'Service scheduled successfully'}), 201

@app.route('/api/schedule/edit/<int:id>', methods=['PUT'])
@login_required
def edit_schedule(id):
    schedule = Schedule.query.get(id)
    if not schedule:
        return jsonify({'error': 'Schedule not found'}), 404

    data = request.get_json()
    schedule_datetime_str = data.get('schedule_datetime')
    try:
        schedule_datetime = datetime.strptime(schedule_datetime_str, '%Y-%m-%dT%H:%M')
    except ValueError:
        return jsonify({'error': 'Invalid date format'}), 400

    if schedule_datetime < datetime.now():
        return jsonify({'error': 'Date & booking cannot be in the past'}), 400

    schedule.schedule_datetime = schedule_datetime
    db.session.commit()
    return jsonify({'message': 'Schedule updated successfully'}), 200

        
        
@app.route('/api/schedule/delete/<int:id>', methods=['DELETE'])
@login_required
def delete_schedule(id):
    user = User.query.get(session['user_id'])
    role_id = user.role_id
    if role_id != 3:
        return jsonify({'error': 'You are not authorized to access this page'}), 403

    schedule = Schedule.query.get(id)
    if schedule.customer_id != session['user_id']:
        return jsonify({'error': 'You do not have permission to delete this schedule'}), 403
    if schedule.is_accepted:
        return jsonify({'error': 'You cannot delete an accepted schedule'}), 400
    if schedule.is_cancelled:
        return jsonify({'error': 'Schedule already cancelled'}), 400
    if schedule.is_completed:
        return jsonify({'error': 'Schedule already completed'}), 400

    schedule.is_active = False
    schedule.is_cancelled = True
    db.session.delete(schedule)
    db.session.commit()
    return jsonify({'message': 'Schedule deleted successfully'}), 200
    


@app.route('/api/schedule/<int:id>/confirm', methods=['POST'])
def confirm_schedule(id):
    # Ensure user is logged in
    if 'user_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user = User.query.get(session['user_id'])
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Ensure user is a professional
    if user.role_id != 2:
        return jsonify({"error": "Access denied. Only professionals can confirm schedules."}), 403

    professional = Professional.query.filter_by(user_id=user.id).first()
    if not professional:
        return jsonify({"error": "Professional profile not found"}), 404

    # Fetch schedule
    schedule = Schedule.query.get(id)
    if not schedule or schedule.is_accepted:
        return jsonify({"error": "No pending schedule to accept"}), 400

    # Create transaction
    transaction = Transaction(
        customer_id=schedule.customer_id,
        professional_id=professional.id,
        amount=0,  # Initial amount, will be updated below
        datetime=datetime.now(),
        status='Accepted'
    )

    # Update transaction amount based on service price
    service = Service.query.get(schedule.service_id)
    if service:
        transaction.amount += float(service.price)

    # Create booking
    booking = Booking(
        transaction=transaction,
        service=schedule.service,
        location=schedule.location,
        date_of_completion=schedule.schedule_datetime.date(),
        rating=None,
        remarks=None
    )

    # Update database
    db.session.add(booking)
    db.session.delete(schedule)
    db.session.add(transaction)
    db.session.commit()

    return jsonify({
        "message": "Schedule confirmed successfully",
        "transaction_id": transaction.id
    }), 200


@app.route('/api/bookings', methods=['GET'])
# @cache.cached(timeout=300, key_prefix="transactions_cache") 
@login_required
def api_bookings():
    user = User.query.get(session['user_id'])
    role_id = user.role_id

    if role_id == 3:  # Customer
        cust_transactions = Transaction.query.filter_by(customer_id=session['user_id']).order_by(Transaction.datetime.desc()).all()
        transactions_data = [
            {
                'id': transaction.id,
                'datetime': transaction.datetime,
                'amount': transaction.amount,
                'status': transaction.status,
                'bookings': [
                    {
                        'id': booking.id,
                        'service': {
                            'name': booking.service.name
                        },
                        'date_of_completion': booking.date_of_completion,
                        'location': booking.location,
                        'rating': booking.rating,
                        'remarks': booking.remarks
                    }
                    for booking in transaction.bookings
                ]
            }
            for transaction in cust_transactions
        ]
        return jsonify({'transactions': transactions_data}), 200

    elif role_id == 2:  # Professional     
        prof_transactions = Transaction.query.filter_by(professional_id=session['user_id']).all()
        print("Professional Transactions:", prof_transactions)  # Debugging

        transactions_data = [
            {
                'id': transaction.id,
                'datetime': transaction.datetime,
                'amount': transaction.amount,
                'status': transaction.status,
                'bookings': [
                    {
                        'id': booking.id,
                        'service': {
                            'name': booking.service.name
                        },
                        'date_of_completion': booking.date_of_completion,
                        'location': booking.location,
                        'rating': booking.rating,
                        'remarks': booking.remarks
                    }
                    for booking in transaction.bookings
                ]
            }
            for transaction in prof_transactions
        ]
        return jsonify({'transactions': transactions_data}), 200

    elif role_id == 1:  # Admin
        transactions = Transaction.query.all()
        users = User.query.all()
        schedules = Schedule.query.all()
        bookings = Booking.query.all()
        customers = Customer.query.all()
        professionals = Professional.query.all()
        pending_professionals = Professional.query.filter_by(is_verified=False, is_flagged=False).all()
        blocked_professionals = Professional.query.filter_by(is_flagged=True).all()
        
        data = {
            'transactions': [
                {
                    'id': transaction.id,
                    'datetime': transaction.datetime,
                    'amount': transaction.amount,
                    'status': transaction.status,
                    'customer_id': transaction.customer_id,
                    'professional_id': transaction.professional_id,
                    'bookings': [
                        {
                            'id': booking.id,
                            'service': {
                                'name': booking.service.name
                            },
                            'date_of_completion': booking.date_of_completion,
                            'location': booking.location,
                            'rating': booking.rating,
                            'remarks': booking.remarks
                        }
                        for booking in transaction.bookings
                    ]
                }
                for transaction in transactions
            ],
            'users': [
                {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'role': Role.query.get(user.role_id).name if user.role_id else None
                }
                for user in users
            ],
            'schedules': [
                {
                    'id': schedule.id,
                    'service_name': schedule.service.name,
                    'schedule_datetime': schedule.schedule_datetime,
                    'location': schedule.location,
                    'is_pending': schedule.is_pending,
                    'is_accepted': schedule.is_accepted,
                    'is_cancelled': schedule.is_cancelled,
                    'is_completed': schedule.is_completed
                }
                for schedule in schedules
            ],
            'bookings': [
                {
                    'id': booking.id,
                    'transaction_id': booking.transaction_id,
                    'service_name': booking.service.name,
                    'location': booking.location,
                    'date_of_completion': booking.date_of_completion,
                    'rating': booking.rating,
                    'remarks': booking.remarks
                }
                for booking in bookings
            ],
            'customers': [
                {
                    'id': customer.id,
                    'name': customer.name,
                    'email': customer.email,
                    'contact': customer.contact,
                    'location': customer.location,
                    'is_blocked': customer.is_blocked
                }
                for customer in customers
            ],
            'professionals': [
                {
                    'id': professional.id,
                    'name': professional.name,
                    'email': professional.email,
                    'contact': professional.contact,
                    'service_type': professional.service_type,
                    'experience': professional.experience,
                    'location': professional.location,
                    'is_verified': professional.is_verified,
                    'is_flagged': professional.is_flagged
                }
                for professional in professionals
            ],
            'pending_professionals': [
                {
                    'id': professional.id,
                    'name': professional.name,
                    'email': professional.email,
                    'contact': professional.contact,
                    'service_type': professional.service_type,
                    'experience': professional.experience,
                    'location': professional.location
                }
                for professional in pending_professionals
            ],
            'blocked_professionals': [
                {
                    'id': professional.id,
                    'name': professional.name,
                    'email': professional.email,
                    'contact': professional.contact,
                    'service_type': professional.service_type,
                    'experience': professional.experience,
                    'location': professional.location
                }
                for professional in blocked_professionals
            ]
        }
        return jsonify(data), 200

    else:
        return jsonify({'error': 'You are not authorized to access this page'}), 403


@app.route('/api/booking/<int:id>/delete', methods=['POST'])
@login_required
def api_delete_booking(id):
    user = User.query.get(session['user_id'])
    role_id = user.role_id
    if role_id != 3:
        return jsonify({'error': 'You are not authorized to access this page'}), 403

    booking = Booking.query.get(id)
    if booking.transaction.customer_id != session['user_id']:
        return jsonify({'error': 'You do not have permission to delete this booking'}), 403
    if booking.transaction.status == 'Accepted':
        return jsonify({'error': 'You cannot delete an accepted booking'}), 400
    if booking.transaction.status == 'Cancelled':
        return jsonify({'error': 'Booking already cancelled'}), 400
    if booking.transaction.status == 'Completed':
        return jsonify({'error': 'Booking already completed'}), 400

    booking.transaction.status = 'Cancelled'
    db.session.commit()

    return jsonify({'message': 'Booking cancelled successfully'}), 200


@app.route('/api/booking/complete/<int:id>', methods=['POST'])
@login_required
def api_complete_booking(id):
    user = User.query.get(session['user_id'])
    role_id = user.role_id
    if role_id != 3:
        return jsonify({'error': 'You are not authorized to access this page'}), 403

    booking = Booking.query.get(id)
    if booking.transaction.customer_id != session['user_id']:
        return jsonify({'error': 'You do not have permission to complete this booking'}), 403
    if booking.transaction.status == 'Cancelled':
        return jsonify({'error': 'Booking already cancelled'}), 400
    if booking.transaction.status == 'Completed':
        return jsonify({'error': 'Booking already completed'}), 400

    booking.transaction.date_of_completion = datetime.now()
    booking.transaction.status = 'Completed'
    db.session.commit()

    return jsonify({'message': 'Booking completed successfully'}), 200


@app.route('/api/booking/rate/<int:id>', methods=['POST'])
@login_required
def api_rate_booking(id):
    user = User.query.get(session['user_id'])
    role_id = user.role_id
    if role_id != 3:
        return jsonify({'error': 'You are not authorized to access this page'}), 403

    booking = Booking.query.get(id)
    transaction = Transaction.query.get(booking.transaction_id)
    if transaction.customer_id != session['user_id']:
        return jsonify({'error': 'You do not have permission to rate this booking'}), 403
    if transaction.status != 'Completed':
        return jsonify({'error': 'You cannot rate a booking that is not completed'}), 400

    data = request.get_json()
    rating = data.get('rating')
    remarks = data.get('remarks')
    if not rating or not remarks:
        return jsonify({'error': 'Please fill out the fields'}), 400

    booking.rating = int(rating)
    booking.remarks = remarks
    db.session.commit()
    username = User.query.get(transaction.customer_id).username
    result = delivery_report.delay(username=username)
    print(result)
    return ({'message': 'Booking rated successfully'}), 200




# #-----------------professional pages-----------------------------------

# GET REQUESTED SCHEDULES

@app.route('/api/pending_booking', methods=['GET'])
@login_required
def api_pending_booking():
    """Fetch all pending bookings for the logged-in professional."""
    professional = Professional.query.filter_by(user_id=session['user_id']).first()
    
    if not professional:
        return jsonify({'error': 'Professional does not exist'}), 404
    
    schedules = Schedule.query.join(Service).join(Category).filter(
        Service.category.has(name=professional.service_type),  # Corrected category mapping
        Schedule.is_pending == True
    ).all()
    
    # Convert schedules to JSON format
    result = [
        {
            'id': schedule.id,
            'customer_id': schedule.customer_id,
            'service_name': schedule.service.name,
            'category': schedule.service.category.name,
            'location': schedule.location,
            'schedule_datetime': schedule.schedule_datetime.isoformat(),
            'is_accepted': schedule.is_accepted,
            'is_pending': schedule.is_pending,
            'is_cancelled': schedule.is_cancelled,
            'is_completed': schedule.is_completed
        }
        for schedule in schedules
    ]
    
    return jsonify({'pending_booking': result}), 200



@app.route('/api/accept_appointment/<int:id>', methods=['POST']) 
@login_required
def api_accept_appointment(id):
    """Accept a pending appointment."""
    schedule = Schedule.query.get(id)
    
    if not schedule:
        return jsonify({'error': 'Schedule does not exist'}), 404
    
    if schedule.is_accepted:
        return jsonify({'error': 'Schedule already accepted'}), 400
    
    if schedule.is_cancelled:
        return jsonify({'error': 'Schedule already cancelled'}), 400
    
    if schedule.is_completed:
        return jsonify({'error': 'Schedule already completed'}), 400
    
    if schedule.professional_id is not None:
        return jsonify({'error': 'Schedule already assigned to a professional'}), 400

    professional = Professional.query.filter_by(user_id=session['user_id']).first()
    
    if not professional:
        return jsonify({'error': 'Professional does not exist'}), 404

    # Ensure professional is accepting only relevant service types
    if schedule.service.category != professional.service_type:
        return jsonify({'error': 'You can only accept schedules related to your service type'}), 403

    # Assign professional to schedule and update status
    schedule.professional_id = professional.id
    schedule.is_accepted = True
    schedule.is_pending = False

    db.session.commit()

    return jsonify({'message': 'Schedule accepted successfully'}), 200


# # ----------------admin page route to fetch all bookings by customers-------------------


@app.route('/api/admin/bookings', methods=['GET'])
# @roles_required('admin')
def admin_bookings():
    users = User.query.all()
    schedules = Schedule.query.all()
    bookings = Booking.query.all()
    transactions = Transaction.query.all()
    customers = Customer.query.all()
    professionals = Professional.query.all()
    print(schedules)
    print(customers)
    print(professionals)
    print(bookings)

    data = {
        'users': [
            {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': Role.query.get(user.role_id).name if user.role_id else None
            }
            for user in users
        ],
        'schedules': [
            {
                'id': schedule.id,
                'service': {
                    'name': schedule.service.name,
                    'price': schedule.service.price
                },
                'schedule_datetime': schedule.schedule_datetime,
                'location': schedule.location,
                'is_pending': schedule.is_pending,
                'is_accepted': schedule.is_accepted,
                'is_cancelled': schedule.is_cancelled,
                'is_completed': schedule.is_completed
            }
            for schedule in schedules
        ],
        'customers': [
            {
                'user_id': customer.id,
                'name': customer.name,
                'location': customer.location
            }
            for customer in customers
        ],
        'professionals': [
            {
                'user_id': professional.id,
                'name': professional.name,
                'location': professional.location
            }
            for professional in professionals
        ],
        'transactions': [
            {
                'id': transaction.id,
                'datetime': transaction.datetime,
                'amount': transaction.amount,
                'status': transaction.status,
                'customer_id': transaction.customer_id,
                'professional_id': transaction.professional_id,
                'bookings': [
                    {
                        'id': booking.id,
                        'service': {
                            'name': booking.service.name,
                            'type': booking.service.type
                        },
                        'location': booking.location,
                        'date_of_completion': booking.date_of_completion,
                        'rating': booking.rating,
                        'remarks': booking.remarks
                    }
                    for booking in transaction.bookings
                ] if transaction.bookings else []
            }
            for transaction in transactions
        ]
        # 'bookings': [
        #     {
        #         'id': booking.id,
        #         'transaction_id': booking.transaction_id,
        #         'service_name': booking.service.name,
        #         'location': booking.location,
        #         'date_of_completion': booking.date_of_completion,
        #         'rating': booking.rating,
        #         'remarks': booking.remarks
        #     }
        #     for booking in bookings
        # ]
    }

    return jsonify(data), 200

