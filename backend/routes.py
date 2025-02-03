from app import app
from flask import jsonify, render_template, request, flash, redirect, url_for, session
from backend.models import db, User, Role,Admin, Professional, Customer, Category, Service, Schedule, Transaction, Booking

from flask_security import login_required, roles_required, current_user, login_user, logout_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from functools import wraps

from flask import request, render_template, redirect, url_for, flash
from flask_security.utils import verify_and_update_password, login_user
import os
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = 'static/uploads'

ALLOWED_EXTENSIONS = {'txt', 'pdf'}

#app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
    

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

# @app.route('/home')
# def home():
#    return render_template('custom_login.html')

@app.route('/protected')
@login_required
def protected():
    return 'protected'


# @app.route('/login', methods=['GET', 'POST'])
# def custom_login():
#     return "Login Page"  # Temporary response working 21/01/25

# @app.route('/login', methods=['GET'])
# def login_form():
#     return render_template('login.html')  # Create a login.html in your templates folder
# @app.route('/api/login', methods=['GET'])
# def login_form():
#     """API endpoint to provide context or status for login."""
#     return jsonify({
#         "message": "Login endpoint is available. Submit credentials via POST request.",
#         "status": "ready"
#     }), 200

# @app.route('/login', methods=['GET', 'POST'])
# def login():
#     if request.method == 'GET':
#         # Render the login page
#         if current_user.is_authenticated:
#             flash("You are already logged in.", "info")
#             return redirect(url_for('home.html'))  # Replace 'home' with your default logged-in route
#         return render_template('login.html')  # Replace 'login.html' with your template

#     elif request.method == 'POST':
#         # Handle login form submission
#         email = request.form.get('email')
#         password = request.form.get('password')

#         # Validate the form data
#         if not email or not password:
#             flash("Please provide both email and password.", "danger")
#             return redirect(url_for('login'))

#         # Fetch the user from the database
#         user = User.query.filter_by(email=email).first()
#         if user and check_password_hash(user.password, password):
#             # Log the user in
#             login_user(user)
#             flash("Login successful!", "success")
#             return '  # Replace dashboard with your destination route'
#         else:
#             flash("Invalid email or password.", "danger")
#             return redirect(url_for('login'))
 
@app.route('/api/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        # Respond with JSON if already authenticated
        if current_user.is_authenticated:
            return jsonify({"message": "You are already logged in."}), 200
        return jsonify({"message": "Please log in to continue."}), 200

    elif request.method == 'POST':
        # Extract email and password from the request
        data = request.get_json()  # Expecting JSON input in POST
        email = data.get('email')
        password = data.get('password')

        # Validate the input
        if not email or not password:
            return jsonify({"error": "Email and password are required."}), 400

        # Fetch the user from the database
        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password, password):
            # Log the user in
            login_user(user)
            return jsonify({
                "message": "Login successful!",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email
                }
            }), 200
        else:
            return jsonify({"error": "Invalid email or password."}), 401



# @app.route('/register', methods=['GET', 'POST'])
# def register():
#     if request.method == 'GET':
#         # Render the registration page
#         if current_user.is_authenticated:
#             flash("You are already registered and logged in.", "info")
#             return  ' # Replace dashboard with your desired route'
#         return render_template('register.html')

#     elif request.method == 'POST':
#         # Handle registration form submission
#         email = request.form.get('email')
#         username = request.form.get('username')
#         password = request.form.get('password')
#         confirm_password = request.form.get('confirm_password')
#         role_name = request.form.get('role')  # Optional: if assigning roles

#         # Validate the form data
#         if not email or not username or not password or not confirm_password:
#             flash("All fields are required.", "danger")
#             return render_template('register.html')

#         if password != confirm_password:
#             flash("Passwords do not match.", "danger")
#             return render_template ('register.html')

#         # Check if the email is already registered
#         if User.query.filter_by(email=email).first():
#             flash("Email already registered. Please log in.", "danger")
#             return render_template ('register.html')

        
#         # Hash the password and create a new user
#         password_hash = generate_password_hash(password)
#         user = User(email=email, username=username, password=password_hash, active=True)

#         # Assign a role to the user if roles exist
#         if role_name:
#             role = Role.query.filter_by(name=role_name).first()
#             if role:
#                 user.roles.append(role)

#         # Add and commit the new user to the database
#         db.session.add(user)
#         db.session.commit()

#         flash("Registration successful! Please log in.", "success")
#         return render_template('login.html')



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

    # Hash the password and create a new user
    password_hash = generate_password_hash(password)
    user = User(email=email, username=username, password=password_hash, active=True)

    # Assign a role to the user if roles exist
    if role_name:
        role = Role.query.filter_by(name=role_name).first()
        if role:
            user.roles.append(role)

    # Add and commit the new user to the database
    db.session.add(user)
    db.session.commit()

    # If the user is assigned the 'Customer' role, create a corresponding entry in the Customer table
    if role_name == 'customer':
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
    elif role_name == 'professional':
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
def admin_dashboard():
    return "Admin Dashboard"
from flask_security import current_user

@app.route('/debug_roles')
def debug_roles():
    return {"roles": [role.name for role in current_user.roles]}


# @app.route('/home')
# @login_required
# def home():
#     user = User.query.get(session['user_id'])
#     session['user_id']= user.id
#     #check role of user and redirect to respective page
#     role = Role.query.get (user.role_id)
#     #check code at admin.txt
#     if role.name =='Admin':
#         admin = Admin.query.filter_by(user_id=user.id).first()
#         if admin:
#             return redirect(url_for('admin_db', username=admin.user.username))
        
#     if role.name == 'Professional':
#         professional = Professional.query.filter_by(user_id=user.id).first()
#         if professional:
#             return redirect(url_for('prof_db', username=professional.users.username))
#     if role.name == 'Customer':
#         customer = Customer.query.filter_by(user_id=user.id).first()
#         if customer:
#             return redirect(url_for('cust_db', username=customer.users.username))

@app.route('/api/home', methods=['GET'])
@login_required  # This will ensure the user is logged in before accessing this route
def home():
    # Check if the user is authenticated
    if not current_user.is_authenticated:
        return jsonify({'error': 'User not authenticated'}), 401

    # Get the user and role information
    user = User.query.get(current_user.id)
    role = Role.query.get(user.role_id)

    # Prepare the response based on the role of the user
    if role.name == 'Admin':
        admin = Admin.query.filter_by(user_id=user.id).first()
        if admin:
            return jsonify({
                'message': 'Admin dashboard',
                'admin_username': admin.user.username,
                'role': role.name
            }), 200
        else:
            return jsonify({'error': 'Admin not found'}), 404

    elif role.name == 'Professional':
        professional = Professional.query.filter_by(user_id=user.id).first()
        if professional:
            return jsonify({
                'message': 'Professional dashboard',
                'professional_username': professional.users.username,
                'role': role.name
            }), 200
        else:
            return jsonify({'error': 'Professional not found'}), 404

    elif role.name == 'Customer':
        customer = Customer.query.filter_by(user_id=user.id).first()
        if customer:
            return jsonify({
                'message': 'Customer dashboard',
                'customer_username': customer.users.username,
                'role': role.name
            }), 200
        else:
            return jsonify({'error': 'Customer not found'}), 404

    return jsonify({'error': 'Role not recognized'}), 400


# #--1. registering a user-----------------------------------
# @app.route('/register')
# def register():
#     # role = Role.query.all()
#     role= Role.query.filter(Role.name.in_(['Professional', 'Customer'])).all()
    
#     return render_template('register.html', role=role)

# @app.route('/register', methods=['POST'])
# def register_post():
#     username = request.form['username']
#     password = request.form['password']
#     confirm_password = request.form['confirm_password']
#     role_id = int(request.form['role_id'])
    
    
#     if not username or not password or not confirm_password:
#         flash('Please enter all the fields')
#         return redirect(url_for('register'))
    
#     if password != confirm_password:
#         flash('Passwords do not match')
#         return redirect(url_for('register'))
    
#     user = User.query.filter_by(username=username).first()
#     if user:
#         flash ('Username already exists')
#         return redirect(url_for('register'))
    
    
      
#     password_hash = generate_password_hash(password)
    
#     new_user= User(username=username, passhash=password_hash,  role_id=role_id)

#     db.session.add(new_user)
#     db.session.commit()

#     flash('User registered successfully')
#     return redirect(url_for('login'))
# #---2. login of all users and redirection to respective/ profile update or dashboard-----------------------------------

# @app.route('/login')
# def login():
#     return render_template('login.html')


    # user = User.query.filter_by(username=username).first()
#     if not username or not password:
#         flash("please enter all the fields")
#         return redirect(url_for('login'))
    
#     user = User.query.filter_by(username=username).first()
#     if not user:
#         flash('You are not registered, Register ^ to login')
#         return redirect(url_for('login'))
    
    
#     if not check_password_hash(user.passhash, password):
#         flash('Incorrect password')
#         return redirect(url_for('login'))
    
#     session['user_id']= user.id
   
#     flash('you have logged in successfully')
#     #check role of user and redirect to respective page
#     role = Role.query.get (user.role_id)
#     #check code at admin.txt
#     if role.name =='Admin':
#         admin = Admin.query.filter_by(user_id=user.id).first()
#         if admin:
            
#             return redirect(url_for('admin_db', username=admin.user.username))
            
#         else:
#             return redirect(url_for('register_adb'))
 
#     elif role.name == 'Professional':
#         professional = Professional.query.filter_by(user_id=user.id).first()
#         print(professional)
#         print(professional)
#         print(professional)


#         if not professional:
#             return redirect(url_for('register_pdb'))
#         if professional.is_flagged:
#                 professional = Professional.query.filter_by(user_id=user.id).first()
#                 return render_template('flag_prof.html', professional=professional)

#         if professional and professional.is_verified:
#             print(professional,'hi')
            
#             #return ('already registered professional page')
#             return redirect(url_for('prof_db', username=professional.users.username))
#         if professional and not professional.is_verified:
#             professional = Professional.query.filter_by(user_id=user.id).first()
#             return render_template('verify_prof.html',professional=professional)
            
        
        
#     elif role.name == 'Customer':
#         customer = Customer.query.filter_by(user_id=user.id).first()
#         if customer:
#             if customer.is_blocked:
#                 return render_template('block_cust.html', customer=customer)
#             return redirect(url_for('cust_db', username=customer.users.username))
#         else:
#             return redirect(url_for('register_cdb'))
#     else:
#         #return redirect(url_for('home'))
#         return redirect(url_for('login'))
    
# #---2a admin registration-----------------------------------
# @app.route('/register_adb')
# def register_adb():
#     return render_template('register_adb.html')

# @app.route('/register_adb', methods=['POST'])
# def register_adb_post():
    
#     user = User.query.get(session['user_id'])
#     admin = Admin.query.filter_by(user_id=user.id).first()
#     if admin:
#         #return ('already registered admin page' )
#         return redirect(url_for('admin_db', username=admin.user.username))
#         #return redirect(url_for('admin_db', name=admin.user.name))
#     name = request.form['name']
    
    
#     if not name:
#         flash('Please enter all the fields')
#         return redirect(url_for('register_adb'))
    
#     new_admin = Admin(user_id=user.id, name=name)
#     db.session.add(new_admin)
#     db.session.commit()
    
#     #Check if admin-specific details are already provided\    
#     flash('Admin registered successfully')
#     return redirect(url_for('admin_db'))
    
# #---2a proffessional registration-----------------------------------
# @app.route('/register_pdb')
# def register_pdb():
#     categories=Category.query.all()
#     print(categories)
#     return render_template('register_pdb.html',categories=categories)

# @app.route('/register_pdb', methods=['POST'])
# def register_pdb_post():
    
#     # professional= Professional.query.filter_by(user_id=user.id).first()

#     # if professional:
#     #     #return ('already registered professional page' )
#     #     return redirect(url_for('prof_db', name=professional.users.username))
    
#     email = request.form['email']
#     name = request.form['name']
#     #username = request.form['username']
#     contact = request.form['contact']
#     service_type = request.form['service_type']
#     experience = request.form['experience']
#     location = request.form['location']
    
#     #file upload 
#     if 'file' in request.files:
#         file = request.files['file']
#         if file.filename == '':
#             flash('No selected file')
#             return redirect(request.url)
#         if file and allowed_file(file.filename):
#             filename = secure_filename(file.filename)
#             file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
#             flash('File uploaded successfully!')

#    #password    = request.form['password']
#     if not email or not name or not contact or not service_type or not experience:
#         flash('Please enter all the fields')
#         return redirect(url_for('register_pdb'))

#     user = User.query.get(session['user_id'])
  
#     new_professional = Professional(user_id=user.id, email=email, name=name, contact=contact, service_type=service_type, experience=experience, location=location, filename=filename)   
#     db.session.add(new_professional)
#     db.session.commit()

    
#     #Check if professional-specific details are already provided  
#     flash('professional registered successfully')
#     # return redirect(url_for('prof_db'))
#     professional = Professional.query.filter_by(user_id=user.id).first()
#     print(professional)
#     print(professional)
#     print(professional)


#     if not professional:
#         return redirect(url_for('register_pdb'))
#     if professional.is_flagged:
#             professional = Professional.query.filter_by(user_id=user.id).first()
#             return render_template('flag_prof.html', professional=professional)

#     if professional and professional.is_verified:
#         print(professional,'hi')
        
#         #return ('already registered professional page')
#         return redirect(url_for('prof_db', username=professional.users.username))
#     if professional and not professional.is_verified:
#         professional = Professional.query.filter_by(user_id=user.id).first()
#         return render_template('verify_prof.html',professional=professional)

@app.route('/api/register_professional', methods=['POST'])
def register_professional():
    if 'user_id' not in session:
        return jsonify({'error': 'User not logged in'}), 401  # Unauthorized

    user = User.query.get(session['user_id'])  # Get logged-in user
    # Continue with registration logic...
    """API to register a professional."""
    data = request.get_json()  # Get JSON data from request body
    
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

    user = User.query.get(session['user_id'])  # Get logged-in user

    # Check if the professional is already registered
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
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return jsonify({"message": "File uploaded successfully", "filename": filename}), 200
    
    return jsonify({"error": "Invalid file type"}), 400


# @app.route('/admin/professionals')
# @roles_required('admin')
# def professionals():   
#     professionals=Professional.query.all()
#     pname = request.args.get('pname') or ''
#     pservice_type = request.args.get('pservice_type') or ''
#     plocation = request.args.get('plocation') or ''
#     print(pname, pservice_type, plocation)

#     if pname:
#         professionals = Professional.query.filter(Professional.name.ilike(f'%{pname}%')).all()
#     return render_template('professionals.html', professionals=professionals, pname=pname, pservice_type=pservice_type, plocation=plocation)

@app.route('/api/admin/professionals', methods=['GET'])
# @roles_required('admin')  # If you want to enforce admin role, you can use this
def professionals():
    pname = request.args.get('pname') or ''
    pservice_type = request.args.get('pservice_type') or ''
    plocation = request.args.get('plocation') or ''

    # Fetch professionals with the given filters
    query = Professional.query

    if pname:
        query = query.filter(Professional.name.ilike(f'%{pname}%'))
    if pservice_type:
        query = query.filter(Professional.service_type.ilike(f'%{pservice_type}%'))
    if plocation:
        query = query.filter(Professional.location.ilike(f'%{plocation}%'))

    professionals = query.all()

    # Prepare the list of professionals to send as response
    professionals_list = [{
        'id': professional.id,
        'name': professional.name,
        'service_type': professional.service_type,
        'location': professional.location
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
# @roles_required('admin')
@login_required
def pending_professionals():
    if current_user.role_id != 1:
        return jsonify({"message": "Forbidden, you must be an admin."}), 403
 
    # Fetch professionals based on verification status and flagging
    pending_professionals = Professional.query.filter_by(is_verified=False, is_flagged=False).all()
    approved_professionals = Professional.query.filter_by(is_verified=True).all()
    blocked_professionals = Professional.query.filter_by(is_flagged=True).all()

    # Prepare data to return
    pending_list = [{'id': prof.id, 'name': prof.name, 'service_type': prof.service_type, 'location': prof.location, 'experience': prof.experience} for prof in pending_professionals]
    approved_list = [{'id': prof.id, 'name': prof.name, 'service_type': prof.service_type, 'location': prof.location, 'experience': prof.experience} for prof in approved_professionals]
    blocked_list = [{'id': prof.id, 'name': prof.name, 'service_type': prof.service_type, 'location': prof.location, 'experience': prof.experience} for prof in blocked_professionals]

    # Return the data as JSON
    return jsonify({
        'pending_professionals': pending_list,
        'approved_professionals': approved_list,
        'blocked_professionals': blocked_list
    }), 200

# # Admin route to approve professional
# @app.route('/admin/approve_professional/<int:id>', methods=['POST'])
# @roles_required('admin')
# def approve_professional(id):    
#     professional = Professional.query.get(id)
#     if professional:
#         professional.is_verified = True
#         #professional.is_flagged = True
#         db.session.commit()
#         flash(f'Professional {professional.name} approved successfully')
#     return redirect(url_for('pending_professionals'))
@app.route('/api/admin/approve_professional/<int:id>', methods=['POST'])
@roles_required('admin')
def approve_professional(id):
    professional = Professional.query.get(id)
    if professional:
        professional.is_verified = True
        # professional.is_flagged = True (if needed, you can include this logic)
        db.session.commit()
        return jsonify({
            'message': f'Professional {professional.name} approved successfully',
            'professional_id': professional.id,
            'is_verified': professional.is_verified
        }), 200
    else:
        return jsonify({'error': 'Professional not found'}), 404

# # Admin route to block professional
# @app.route('/admin/block_professional/<int:id>', methods=['POST'])
# @roles_required('admin')
# def block_professional(id):    
#     professional = Professional.query.get(id)
#     if professional:
#         professional.is_flagged = True
       
#         professional.is_verified = False
#         db.session.commit()
#         flash(f'Professional {professional.name} blocked successfully')
#     return redirect(url_for('pending_professionals'))

@app.route('/api/admin/block_professional/<int:id>', methods=['POST'])
# @roles_required('admin')  # Can be handled through Flask-Security or other role-based checks
def block_professional(id):
    # Check if the current user is an admin
    if not current_user.is_authenticated or current_user.role.name != 'Admin':
        return jsonify({'error': 'Unauthorized access. Admins only.'}), 403

    # Fetch the professional by ID
    professional = Professional.query.get(id)
    if professional:
        # Block the professional by updating their flags
        professional.is_flagged = True
        professional.is_verified = False
        db.session.commit()

        # Return success response
        return jsonify({
            'message': f'Professional {professional.name} blocked successfully',
            'professional_id': professional.id,
            'is_flagged': professional.is_flagged,
            'is_verified': professional.is_verified
        }), 200

    return jsonify({'error': 'Professional not found'}), 404


# # Admin route to unblock professional
# @app.route('/admin/unblock_professional/<int:id>', methods=['POST'])
# @roles_required('admin')
# def unblock_professional(id):   
#     professional = Professional.query.get(id)
#     if professional:
#         professional.is_flagged = False
#         db.session.commit()
#         flash(f'Professional {professional.name} unblocked successfully')
#     return redirect(url_for('pending_professionals'))

@app.route('/api/admin/unblock_professional/<int:id>', methods=['POST'])
@roles_required('admin')  # Ensure only admins can access this route
def unblock_professional(id):
    professional = Professional.query.get(id)
    if professional:
        # Unblock the professional
        professional.is_flagged = False
        db.session.commit()
        return jsonify({
            'message': f'Professional {professional.name} unblocked successfully',
            'professional_id': professional.id,
            'status': 'unblocked'
        }), 200
    else:
        return jsonify({
            'error': 'Professional not found'
        }), 404

# #  professional dashboard link to show all the appointments- accept/ reject
    




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
# @app.route('/admin/customers')
# @login_required
# def customers():  
#     customers=Customer.query.all()
#     cname = request.args.get('cname') or ''
#     clocation = request.args.get('clocation') or ''
#     print(cname, clocation)

#     if cname:
#         customers = Customer.query.filter(Customer.name.ilike(f'%{cname}%')).all()
#     return render_template('customers.html', customers=customers, cname=cname, clocation=clocation)
@app.route('/api/admin/customers', methods=['GET'])
def get_customers():
    # Ensure the user is authenticated and has the proper role (Admin)
    if not current_user.is_authenticated or current_user.role.name != 'Admin':
        return jsonify({'error': 'Unauthorized access'}), 403

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
        'location': customer.location
    } for customer in customers]

    return jsonify(customer_list), 200

# #admin route to manage customers
# @app.route('/api/admin/manage_customers', methods=['GET'])
# @roles_required('admin')  # Uncomment if you have role-based access control
def manage_customers():
    """Fetch all customers categorized by blocked status."""
    unblocked_customers = Customer.query.filter_by(is_blocked=False).all()
    blocked_customers = Customer.query.filter_by(is_blocked=True).all()

    response = {
        "unblocked_customers": [
            {"id": c.id, "name": c.users.username, "email": c.users.email} for c in unblocked_customers
        ],
        "blocked_customers": [
            {"id": c.id, "name": c.users.username, "email": c.users.email} for c in blocked_customers
        ],
    }

    return jsonify(response), 200

# # Admin route to unblock customer
# @app.route('/admin/unblock_customer/<int:id>', methods=['POST'])
# @roles_required('admin')
# def unblock_customer(id):
#     customer = Customer.query.get(id)
#     if customer:
#         customer.is_blocked = False
#         db.session.commit()
#         flash(f'Customer {customer.name} unblocked successfully')
#     return redirect(url_for('manage_customers'))  
@app.route('/api/admin/unblock_customer/<int:id>', methods=['POST'])
# @roles_required('admin')  # Uncomment this if role-based access is needed
def api_unblock_customer(id):
    customer = Customer.query.get(id)
    
    if not customer:
        return jsonify({'error': 'Customer not found'}), 404
    
    customer.is_blocked = False
    db.session.commit()
    
    return jsonify({'message': f'Customer {customer.name} unblocked successfully'}), 200


# # Admin route to block customer
# @app.route('/admin/block_customer/<int:id>', methods=['POST'])
# @roles_required('admin')
# def block_customer(id):   
#     customer = Customer.query.get(id)
#     if customer:
#         customer.is_blocked = True
       
#         db.session.commit()
#         flash(f'Customer {customer.name} blocked successfully')
#     return redirect(url_for('manage_customers'))
@app.route('/api/admin/block_customer/<int:id>', methods=['POST'])
# @roles_required('admin')  # Uncomment when role-based access control is handled
def block_customer(id):   
    customer = Customer.query.get(id)
    
    if not customer:
        return jsonify({"error": "Customer not found"}), 404

    customer.is_blocked = True
    db.session.commit()
    
    return jsonify({"message": f"Customer {customer.name} blocked successfully"}), 200

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
# @app.route('/signout')
# @login_required
# def signout():
#     session.pop('user_id')
#     return render_template('home.html')
@app.route('/api/signout', methods=['POST'])
def signout():
    if not current_user.is_authenticated:
        return jsonify({'error': 'User not logged in'}), 401

    logout_user()
    return jsonify({'message': 'Successfully signed out'}), 200

# @app.route('/delete/prof')
# @login_required
# def delete_prof():
#     user = User.query.get(session['user_id'])

#     if user:
#         professional = Professional.query.filter_by(user_id=user.id).first()
#         if professional:
#             db.session.delete(professional)
        
#         db.session.delete(user)
#         db.session.commit()
#     else:
#         print("User not found.")

#     return render_template('homecss.html')
@app.route('/api/delete/prof', methods=['DELETE'])
@login_required
def delete_prof():
    user = User.query.get(session.get('user_id'))

    if not user:
        return jsonify({"error": "User not found"}), 404

    professional = Professional.query.filter_by(user_id=user.id).first()
    if professional:
        db.session.delete(professional)

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "User and professional profile deleted successfully"}), 200

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
        
        db.session.delete(user)  # Delete user record
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

    professionals_data = [
        {"id": p.id, "name": p.name, "email": p.users.email} for p in professionals
    ]

    customers_data = [
        {"id": c.id, "name": c.name, "email": c.users.email} for c in customers
    ]

    return jsonify({
        "users": users_data,
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


           

            


# @app.route('/profile')
# @login_required
# def profile():
#     user = User.query.get(session['user_id'])
#     role = Role.query.get (user.role_id)
   
#     #if user is admin, redirect to profile_admin page
#     if role.name == 'Admin':
#         return render_template('profile_admin.html', user=user)
#     elif role.name == 'Professional':
#         professional = Professional.query.filter_by(user_id=user.id).first()
#         return render_template('profile_prof.html', user=user, professional=professional)
#     elif role.name == 'Customer':
#         customer = Customer.query.filter_by(user_id=user.id).first()
#         return render_template('profile_cust.html', user=user, customer=customer)
#     flash('Unexpected role. Please contact support.')
#     return redirect(url_for('home')) 
@app.route('/api/profile', methods=['GET'])
@login_required
def profile():
    user = User.query.get(session.get('user_id'))
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
            profile_data["professional"] = {
                "id": professional.id,
                "experience": professional.experience,
                "service_type": professional.service_type
            }
    
    elif role.name == 'Customer':
        customer = Customer.query.filter_by(user_id=user.id).first()
        if customer:
            profile_data["customer"] = {
                "id": customer.id,
                "location": customer.location
            }

    return jsonify(profile_data), 200

# @app.route('/profile', methods=['POST'])
# @login_required
# def profile_post():
#     # if user is admin, redirect to profile_admin page
#     user = User.query.get(session['user_id'])
#     role = Role.query.get(user.role_id)
    
#     if role.name == 'Admin':
        
#         admin = Admin.query.filter_by(user_id=user.id).first()
#         username=request.form.get('username')
#         cpassword=request.form.get('cpassword')
#         password=request.form.get('password')
#         admin.name=request.form.get('name')

#         if not username or not cpassword or not password:
#             flash('Please fill out the fields')
#             return redirect(url_for('profile'))
        
#         #check if current password entered to update is correct
#         user = User.query.get(session['user_id'])
#         if not check_password_hash(user.passhash, cpassword):
#             flash('Incorrect current password')
#             return redirect(url_for('profile'))
#         #check if new username id available
#         if username != user.username:
#             user = User.query.filter_by(username=username).first()
#             if user:
#                 flash('Username already exists')
#                 return redirect(url_for('profile'))      
            
#         new_password_hash = generate_password_hash(password)
#         user.username = username
#         user.passhash = new_password_hash
#         user.name = admin.name

#         db.session.commit()
#         flash('Profile updated successfully')
#         return redirect(url_for('home'))
    
    
#     elif role.name == 'Professional':
        
#         professional = Professional.query.filter_by(user_id=user.id).first()
#         if not professional:
#             flash('Professional profile not found')
#             return redirect(url_for('profile'))

#         username=request.form.get('username')
#         cpassword=request.form.get('cpassword')
#         password=request.form.get('password')
#         professional.email = request.form.get('email') or professional.email
#         professional.name = request.form.get('name') or professional.name
#         professional.contact = request.form.get('contact') or professional.contact
#         professional.location = request.form.get('location') or professional.location
#         professional.experience = request.form.get('experience') or professional.experience
#         professional.service_type = professional.service_type

#         if not username or not cpassword or not password:
#             flash('Please fill out the fields')
#             return redirect(url_for('profile'))
        
#         #check if current password entered to update is correct
#         #user = User.query.get(session['user_id'])
#         if not check_password_hash(user.passhash, cpassword):
#             flash('Incorrect current password')
#             return redirect(url_for('profile'))
#         #check if new username id available
#         if username != user.username:
#             existing_user = User.query.filter_by(username=username).first()
#             if existing_user:
#                 flash('Username already exists')
#                 return redirect(url_for('profile'))   

#         new_password_hash = generate_password_hash(password)
#         user.username = username
#         user.passhash = new_password_hash
#         user.name = professional.name
#         professional.email = professional.email
#         professional.contact = professional.contact
#         professional.location = professional.location
#         professional.service_type = professional.service_type
#         professional.experience = professional.experience


#         db.session.commit()
#         flash('Profile updated successfully')
#         return redirect(url_for('home'))
    
    

#     elif role.name == 'Customer':
        
#         customer = Customer.query.filter_by(user_id=user.id).first()
#         if not customer:
#             flash('Customer profile not found')
#             return redirect(url_for('profile'))

#         username=request.form.get('username')
#         cpassword=request.form.get('cpassword')
#         password=request.form.get('password')
#         customer.email = request.form.get('email') or customer.email
#         customer.name = request.form.get('name') or customer.name
#         customer.contact = request.form.get('contact') or customer.contact
#         customer.location = request.form.get('location') or customer.location

#         if not username or not cpassword or not password:
#             flash('Please fill out the fields')
#             return redirect(url_for('profile'))
        
#         #check if current password entered to update is correct
#         #user = User.query.get(session['user_id'])
#         if not check_password_hash(user.passhash, cpassword):
#             flash('Incorrect current password')
#             return redirect(url_for('profile'))
#         #check if new username id available
#         if username != user.username:
#             existing_user = User.query.filter_by(username=username).first()
#             if existing_user:
#                 flash('Username already exists')
#                 return redirect(url_for('profile'))   

#         new_password_hash = generate_password_hash(password)
#         user.username = username
#         user.passhash = new_password_hash
#         user.name = customer.name
#         customer.email = customer.email
#         customer.contact = customer.contact
#         customer.location = customer.location
    

#         db.session.commit()
#         flash('Profile updated successfully')
#         return redirect(url_for('home'))
    
#     flash('Unexpected role. Please contact support.')
#     return redirect(url_for('home'))
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

    # Extract common fields
    username = data.get('username')
    cpassword = data.get('cpassword')
    password = data.get('password')

    if not username or not cpassword or not password:
        return jsonify({'error': 'Please fill out all required fields'}), 400

    # Validate current password
    if not check_password_hash(user.passhash, cpassword):
        return jsonify({'error': 'Incorrect current password'}), 403

    # Check if the new username is already taken
    if username != user.username:
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return jsonify({'error': 'Username already exists'}), 409

    # Hash the new password
    new_password_hash = generate_password_hash(password)
    user.username = username
    user.passhash = new_password_hash

    # Role-specific updates
    if role.name == 'Admin':
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






    
# #-------admin pages-----------------------------------
# @app.route('/admin_db')
# @roles_required('admin')
# def admin_db():
#     categories=Category.query.all()
#     category_names = [category.name for category in categories]
#     category_sizes = [len(category.services) for category in categories]
#     admin = Admin.query.filter_by(user_id=session['user_id']).first()
    
   
#     pending_professionals = [Professional.query.filter_by(is_verified=False).count()]
#     blocked_professionals = [Professional.query.filter_by(is_flagged=True).count()]
#     approved_professionals = [Professional.query.filter_by(is_verified=True).count()]

#     blocked_customers = [Customer.query.filter_by(is_blocked=True).count()]
#     unblocked_customers = [Customer.query.filter_by(is_blocked=False).count()]

#     return render_template('admin_db.html',categories=categories, category_names=category_names, category_sizes=category_sizes, blocked_professionals=blocked_professionals, pending_professionals=pending_professionals, approved_professionals=approved_professionals, blocked_customers=blocked_customers, unblocked_customers=unblocked_customers, admin=admin)

@app.route('/api/admin_db', methods=['GET'])
@roles_required('admin')
def admin_db():
    """Fetch admin dashboard data as JSON"""
    admin = Admin.query.filter_by(user_id=session.get('user_id')).first()
    
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

@app.route('/api/category/add', methods=['GET'])
@roles_required('admin')
def add_category():
    """Get a list of categories along with the count of services in each category."""
    categories = Category.query.all()

    category_list = [{
        'id': category.id,
        'name': category.name,
        'service_count': len(category.services)
    } for category in categories]

    return jsonify({'categories': category_list}), 200

# @app.route('/category/add',methods=['POST'])
# @roles_required('admin')
# def add_category_post():
#     name = request.form.get('name')
#     if not name:
#         flash('Please fill out the fields')
#         return redirect(url_for('add_category'))
#     category = Category(name=name)
#     db.session.add(category)
#     db.session.commit()
#     flash("Service_Type added successfully")
#     return redirect(url_for('add_service', category_id=category.id))
@app.route('/api/category/add', methods=['POST'])
@roles_required('admin')
def add_category_post():
    data = request.get_json()  # Get JSON data from request
    name = data.get('name')

    if not name:
        return jsonify({'error': 'Please provide a category name'}), 400  # Bad Request

    category = Category(name=name)
    db.session.add(category)
    db.session.commit()

    return jsonify({
        'message': 'Service_Type added successfully',
        'category_id': category.id
    }), 201  # Created


# @app.route('/category/<int:id>/')
# @roles_required('admin')
# def show_category(id):
#     category=Category.query.get(id)
#     if not category:
#         flash('Service_Type does not exist')
#         return redirect(url_for('admin_db'))
#     return render_template('category/show.html', category=category)
#     #return("show category")
@app.route('/api/category/<int:id>/', methods=['GET'])
# @roles_required('admin')
def show_category(id):
    category = Category.query.get(id)
    if not category:
        return jsonify({'error': 'Service_Type does not exist'}), 404

    return jsonify({
        'id': category.id,
        'name': category.name,
        'description': category.description
    }), 200


# @app.route('/category/<int:id>/edit')
# @roles_required('admin')
# def edit_category(id):
#     category=Category.query.get(id)
    
#     if not category:
#         flash('Service_Type does not exist')
#         return redirect(url_for('admin_db'))
#     return render_template("category/edit.html", category=category)

# @app.route('/category/<int:id>/edit', methods=['POST'])
# @roles_required('admin')
# def edit_category_post(id):
#     category=Category.query.get(id)    
#     if not category:
#         flash('Service_Type does not exist')
#         return redirect(url_for('admin'))
#     name=request.form.get('name')
#     if not name:
#         flash('Please fill out the fields')
#         return redirect(url_for('edit_category',id=id))
#     category.name=name
#     db.session.commit()
#     flash('Service_Type updated successfully')  
#     return redirect(url_for('add_category'))
    

# @app.route('/category/<int:id>/delete')
# @login_required
# def delete_category(id):
#     category = Category.query.get(id)
#     if not category:
#         flash('Service_Type does not exist')
#         return redirect(url_for('admin_db'))
#     return render_template('category/delete.html', category=category)

# @app.route('/category/<int:id>/delete', methods=['POST'])
# @login_required
# def delete_category_post(id):
#     category = Category.query.get(id)
#     if not category:
#         flash('Service_Type does not exist')
#         return redirect(url_for('admin_db'))
#     db.session.delete(category)
#     db.session.commit()
#     flash('Service_Type deleted successfully')
#     return redirect(url_for('add_category'))

# #----------- Add services packages in a category-----------------------------------
# @app.route('/service/add/<int:category_id>')
# @roles_required('admin')
# def add_service(category_id):
#     category=Category.query.get(category_id)
#     categories=Category.query.all() 
#     if not category:
#         flash('Service_Type does not exist')
#         return redirect(url_for('admin_db'))
    
#     return render_template('service/add.html', category=category, categories=categories)

# @app.route('/service/add/', methods=['POST'])
# @roles_required('admin')
# def add_service_post():
#     name = request.form.get('name')
#     category_id = request.form.get('category_id')
#     type = request.form.get('type')
#     description = request.form.get('description')
#     price = request.form.get('price')
#     location = request.form.get('location')
#     duration = request.form.get('duration')
    
#     category = Category.query.get(category_id)

#     if not category:
#         flash('Service_Type does not exist')
#         return redirect(url_for('admin_db'))
#     if not name or not price or not type or not description or not location or not duration:
#         flash('Please fill out the fields')
#         return redirect(url_for('add_service', category_id=category_id))
    
#     try:
    
#         price=float(price)
        
#     except ValueError:
#         flash('price')
#         return redirect(url_for('add_service', category_id=category_id))
    
#     if price <= 0:
#         flash('Price cannot be negative')
#         return redirect(url_for('add_service', category_id=category_id))
    
    
#     service = Service(name=name, price=price, category=category, type=type, description=description, location=location, duration=duration)
#     db.session.add(service)
#     db.session.commit()
#     flash("Service added successfully")
#     return redirect(url_for('show_category', id=category_id))



# @app.route('/service/<int:id>/edit')
# @roles_required('admin')
# def edit_service(id):
#     service=Service.query.get(id)
#     categories=Category.query.all() 
#     return render_template('service/edit.html', categories=categories,service=service)

# @app.route('/service/<int:id>/edit', methods=['POST'])
# @roles_required('admin')
# def edit_service_post(id):
#     name = request.form.get('name')
#     category_id = request.form.get('category_id')
#     type = request.form.get('type')
#     description = request.form.get('description')
#     price = request.form.get('price')
    
#     category = Category.query.get(category_id)
#     if not category:
#         flash('Service_Type does not exist')
#         return redirect(url_for('admin_db'))
#     if not name or not price or not type or not description:
#         flash('Please fill out the fields')
#         return redirect(url_for('add_service', category_id=category_id))
    
#     try:
#         price=float(price)
        
#     except ValueError:
#         flash('Invalid quantity or price')
#         return redirect(url_for('add_service', category_id=category_id))
    
#     if price <= 0:
#         flash('Quantity or price cannot be negative')
#         return redirect(url_for('add_service', category_id=category_id))

#     service=Service.query.get(id)
#     service.name=name
#     service.category=category
#     service.type=type
#     service.description=description
#     service.price=price
    
    
#     db.session.commit()
#     flash("Service edited successfully")
#     return redirect(url_for('show_category', id=category_id))

# @app.route('/service/<int:id>/delete')
# @roles_required('admin')
# def delete_service(id):

#     service = Service.query.get(id)
#     if not service:
#         flash('Service does not exist')
#         return redirect(url_for('admin_db'))
#     return render_template('service/delete.html', service=service)

# @app.route('/service/<int:id>/delete', methods=['POST'])
# @login_required
# def delete_service_post(id):
#     service = Service.query.get(id)
#     if not service:
#         flash('Service does not exist')
#         return redirect(url_for('admin_db'))
#     category_id = service.category.id
#     db.session.delete(service)
#     db.session.commit()
#     flash('Service deleted successfully')
#     return redirect(url_for('show_category', id=category_id))

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

# @app.route('/catalogue')
# @login_required
# def catalogue():
#     #user_id in session/ if user id exists in session we will allow them to see catalogue.html
#     #if user is an admin he goes to admin page else user page>> get user
#     # user=User.query.get(session['user_id'])
#     # if user.is_admin:
#     #     return redirect(url_for('admin'))
    
#     categories=Category.query.all()

#     cname = request.args.get('cname') or ''
#     sname = request.args.get('sname') or ''
#     price = request.args.get('price')
#     location = request.args.get('location') or ''
#     datetime = request.args.get('datetime') or ''
#     description = request.args.get('description') or ''

#     if price:
#         try:
#             price = float(price)
#         except ValueError:
#             flash('Invalid price')
#             return redirect(url_for('catalogue'))
#         if price <= 0:
#             flash('Price cannot be negative')
#             return redirect(url_for('catalogue'))

#     if cname:
#         categories = Category.query.filter(Category.name.ilike(f'%{cname}%')).all()
#     return render_template('catalogue.html', categories=categories, cname=cname, sname=sname, price=price, location=location, datetime=datetime, description=description)

# @app.route('/add_to_schedule/<int:service_id>', methods=['POST'])
# @login_required
# def add_to_schedule(service_id):
#     service = Service.query.get(service_id)
#     if not service:
#         flash('Service does not exist')
#         return redirect(url_for('catalogue'))
    
#     location = request.form.get('location')
#     if not location:
#         flash('Please enter location')
#         return redirect(url_for('catalogue'))
    
#     schedule_datetime_str = request.form.get('schedule_datetime')
#     try:
#         schedule_datetime = datetime.strptime(schedule_datetime_str, '%Y-%m-%dT%H:%M')
#     except ValueError:
#         flash('Invalid date format')
#         return redirect(url_for('catalogue'))
    
#     if schedule_datetime < datetime.now():
#         flash('Date & booking cannot be in the past')
#         return redirect(url_for('catalogue'))
    
#     schedule = Schedule.query.filter_by(service_id=service_id,schedule_datetime=schedule_datetime).first()
#     if schedule:
#         flash('Service already added to schedule')
#         return redirect(url_for('catalogue'))
#     else:
#         schedule = Schedule(
#             customer_id=session['user_id'], 
#             service_id=service_id, 
#             schedule_datetime=schedule_datetime, 
#             location=location,
#             is_pending=True,
#             is_active=True,
#             is_accepted=False,
#             is_cancelled=False,
#             is_completed=False
#         )
            
       

#         db.session.add(schedule)
#     db.session.commit()
     
#     flash('Service added to schedule successfully')
#     return redirect(url_for('schedule'))







# # ------------------------backend.routes from cust_db--------------------
# @app.route('/schedule')
# @login_required
# def schedule():
#     user = User.query.get(session['user_id'])
#     role_id = user.role_id
#     if role_id == 2:
#         professional = Professional.query.filter_by(user_id=session['user_id']).first()

#         if not professional:
#             flash('Professional does not exist')
#             return redirect(url_for('login'))
    
#         schedules = Schedule.query.join(Service).join(Category).filter(Category.name == professional.service_type).all()
#         return render_template('view_appointments.html', schedules=schedules)
    
#     elif role_id == 3:
#             customer = Customer.query.filter_by(user_id=session['user_id']).first()

#             if not customer:
#                 flash('Customer does not exist')
#                 return redirect(url_for('login'))
#             schedules = Schedule.query.filter_by(customer_id=session['user_id']).all()
#             schedules = Schedule.query.filter_by(customer_id=session['user_id']).all()
#             return render_template('schedule.html', schedules=schedules)
#     else:
#         flash('You are not authorized to access this page')
#         return redirect(url_for('home'))
    
# @app.route('/schedule/<int:id>/edit')
# @login_required
# def edit_schedule(id):
    
#     schedule = Schedule.query.get(id)
#     return render_template('schedule_edit.html', schedule=schedule)

# @app.route('/schedule/<int:id>/edit', methods=['POST'])
# @login_required
# def edit_schedule_post(id):
#     schedule = Schedule.query.get(id)
#     if not schedule:
#         flash('schedule not found')
#         return  render_template(schedule.html)
#     print(schedule)
#     edit_sch = request.form.get('schedule_datetime')
#     print(schedule.schedule_datetime)
#     schedule_datetime_str = request.form.get('schedule_datetime')
#     try:
#         schedule_datetime = datetime.strptime(schedule_datetime_str, '%Y-%m-%dT%H:%M')
#     except ValueError:
#         flash('Invalid date format')
#         return redirect(url_for('catalogue'))
    
#     if schedule_datetime < datetime.now():
#         flash('Date & booking cannot be in the past')
#         return redirect(url_for('catalogue'))
#     schedule_datetime_obj = datetime.fromisoformat( edit_sch)
#     schedule.schedule_datetime = schedule_datetime_obj
    
    
#     db.session.commit()
#     flash('schedule updated')
#     schedules = Schedule.query.filter_by(customer_id=session['user_id']).all()
#     return render_template('schedule.html',schedule=schedule,schedules=schedules)

        
        

# @app.route('/schedule/<int:id>/delete', methods=['POST'])   
# @login_required
# def delete_schedule(id):
#     user = User.query.get(session['user_id'])
#     role_id = user.role_id
#     if role_id != 3:
#         flash('You are not authorized to access this page')
#         return redirect(url_for('home'))
    
#     schedule = Schedule.query.get(id)        
#     if schedule.customer_id != session['user_id']:
#         flash('You do not have permission to delete this schedule')
#         return redirect(url_for('schedule'))
#     if schedule.customer_id != session['user_id']:
#         flash('You do not have permission to delete this schedule')
#         return redirect(url_for('schedule'))
#     if schedule.is_accepted:
#         flash('You cannot delete an accepted schedule')
#         return redirect(url_for('schedule'))
#     if schedule.is_cancelled:
#         flash('Schedule already cancelled')
#         return redirect(url_for('schedule'))
#     if schedule.is_completed:
#         flash('Schedule already completed')
#         return redirect(url_for('schedule'))
#     schedule.is_active = False
#     schedule.is_cancelled = True
    
    
#     db.session.delete(schedule)
#     db.session.commit()
#     flash('Schedule deleted successfully, Create new one')
#     return redirect(url_for('schedule'))
    

# @app.route('/schedule/<int:id>/confirm', methods=['POST'])
# @login_required
# def confirm(id):
#     user = User.query.get(session['user_id'])
#     role_id = user.role_id

#     if role_id == 2:
#         professional = Professional.query.filter_by(user_id=session['user_id']).first()
#         if not professional:
#             flash('Professional does not exist')
#             return redirect(url_for('login'))
        
#         schedule = Schedule.query.get(id)
#         if not schedule or schedule.is_accepted:
#             # flash('No pending schedule to accept')
#             return redirect(url_for('pending_booking'))
        
#         transaction = Transaction(customer_id=schedule.customer_id, professional_id=professional.id, amount=0, datetime=datetime.now(), status='Accepted')
#         service = Service.query.get(schedule.service_id)
#         transaction.amount += float(service.price)

#         booking = Booking(
#             transaction=transaction,
#             service=schedule.service,
#             location=schedule.location,
#             date_of_completion=schedule.schedule_datetime.date(),
#             rating=None,
#             remarks=None
#         )
#         db.session.add(booking)
#         db.session.delete(schedule)
#         db.session.add(transaction)
#         db.session.commit()

#         flash('Schedule accepted successfully')
#         # return redirect(url_for('pending_booking'))
#         return render_template('prof_booking.html',transactions=Transaction.query.filter_by(professional_id=professional.id).all())
                            
# @app.route('/bookings')
# @login_required
# def bookings():
#     user = User.query.get(session['user_id'])
#     role_id = user.role_id

#     if role_id == 3:  # Customer
#         cust_transactions = Transaction.query.filter_by(customer_id=session['user_id']).order_by(Transaction.datetime.desc()).all()
#         return render_template('cust_bookings.html', transactions=cust_transactions)
#     elif role_id == 2:  # Professional
#         professional = Professional.query.filter_by(user_id=session['user_id']).first()
#         if not professional:
#             flash('Professional does not exist')
#             return redirect(url_for('login'))
        
#         prof_transactions = Transaction.query.filter_by(professional_id=professional.id).order_by(Transaction.datetime.desc()).all()
#         print(prof_transactions)
#         return render_template('prof_booking.html', transactions=prof_transactions)
#     elif role_id == 1:  # Admin
#         transactions = Transaction.query.all()
#         users = User.query.all()
#         schedules = Schedule.query.all()    
#         transactions = Transaction.query.all()
#         bookings = Booking.query.all()
#         customers = Customer.query.all()
#         professionals = Professional.query.all()
#         pending_professionals = Professional.query.filter_by(is_verified=False,is_flagged=False).all()
#         blocked_professionals = Professional.query.filter_by(is_flagged=True).all()
    
#         return render_template('admin_booking.html', bookings=bookings, schedules=schedules, transactions=transactions, customers=customers, professionals=professionals,users=users, pending_professionals=pending_professionals, blocked_professionals=blocked_professionals)
#     else:
#         flash('You are not authorized to access this page')
#         return redirect(url_for('home'))    

# @app.route('/booking/<int:id>/delete', methods=['POST'])
# @login_required
# def delete_booking(id):
#     user = User.query.get(session['user_id'])
#     role_id = user.role_id
#     if role_id != 3:
#         flash('You are not authorized to access this page')
#         return redirect(url_for('home'))
#     booking = Booking.query.get(id)
#     if booking.transaction.customer_id != session['user_id']:
#         flash('You do not have permission to delete this booking')
#         return redirect(url_for('bookings'))
#     if booking.transaction.status == 'Accepted':
#         flash('You cannot delete an accepted booking')
#         return redirect(url_for('bookings'))
#     if booking.transaction.status == 'Cancelled':
#         flash('Booking already cancelled')
#         return redirect(url_for('bookings'))
#     if booking.transaction.status == 'Completed':
#         flash('Booking already completed')
#         return redirect(url_for('bookings'))
#     booking.transaction.status = 'Cancelled'
#     db.session.commit()

#     flash('Booking cancelled successfully')
#     return redirect(url_for('bookings'))


# @app.route('/booking/<int:id>/complete', methods=['POST'])
# @login_required
# def complete_booking(id):
#     user = User.query.get(session['user_id'])
#     role_id = user.role_id
#     if role_id != 3:
#         flash('You are not authorized to access this page')
#         return redirect(url_for('home'))
#     booking = Booking.query.get(id)
#     if booking.transaction.customer_id != session['user_id']:
#         flash('You do not have permission to complete this booking')
#         return redirect(url_for('bookings'))
    
#     if booking.transaction.status == 'Cancelled':
#         flash('Booking already cancelled')
#         return redirect(url_for('bookings'))
#     if booking.transaction.status == 'Completed':
#         flash('Booking already completed')
#         return redirect(url_for('bookings'))
    
#     booking.transaction.date_of_completion = datetime.now()
#     booking.transaction.status = 'Completed'
#     db.session.commit()

#     flash('Booking completed successfully')
    
#     return redirect(url_for('bookings'))


# @app.route('/booking/<int:id>/rate', methods=['POST'])
# @login_required
# def rate_booking(id):
#     user = User.query.get(session['user_id'])
#     role_id = user.role_id
#     if role_id != 3:
#         flash('You are not authorized to access this page')
#         return redirect(url_for('home'))
#     booking = Booking.query.get(id)
#     transaction = Transaction.query.get(booking.transaction_id)
#     print(booking)
#     print(transaction)
#     if transaction.customer_id != session['user_id']:
#         flash('You do not have permission to rate this booking')
#         return redirect(url_for('bookings'))
#     if transaction.status != 'Completed':
#         flash('You cannot rate a booking that is not completed')
#         return redirect(url_for('bookings'))
#     rating = request.form.get('rating')
#     remarks = request.form.get('remarks')
#     if not rating or not remarks:
#         flash('Please fill out the fields')
#         return redirect(url_for('bookings'))
#     rating = int(rating)
#     print(rating, type(rating), remarks)
   
#     booking.rating = rating
#     booking.remarks = remarks
#     db.session.commit()
#     flash('Booking rated successfully')
#     return redirect(url_for('bookings'))


# #-----------------professional pages-----------------------------------
    
# # ----booking request to professional-------------------   
# @app.route('/pending_booking')
# @login_required
# def pending_booking():
#     professional = Professional.query.filter_by(user_id=session['user_id']).first()

#     if not professional:
#         flash('Professional does not exist')
#         return redirect(url_for('login'))
    
#     schedules = Schedule.query.join(Service).join(Category).filter(Category.name == professional.service_type).all()
#     return render_template('view_appointments.html', schedules=schedules)


# # route for accept appointment
# @app.route('/accept_appointment/<int:id>', methods=['POST'])
# @login_required
# def accept_appointment(id):
#     schedule = Schedule.query.get(id)
#     if not schedule:
#         flash('Schedule does not exist')
#         return redirect(url_for('pending_booking'))
#     if schedule.is_accepted:
#         flash('Schedule already accepted')
#         return redirect(url_for('pending_booking'))
#     if schedule.is_cancelled:
#         flash('Schedule already cancelled')
#         return redirect(url_for('pending_booking'))
#     if schedule.is_completed:
#         flash('Schedule already completed')
#         return redirect(url_for('pending_booking'))
#     schedule.professional_id = Professional.query.filter_by(user_id=session['user_id']).first().id
#     schedule.is_accepted = True
#     schedule.is_pending = False

#     db.session.commit()
#     db.session.delete(schedule)
#     #delete from prof table
#     flash('Schedule accepted successfully')

# # ----------------admin page route to fetch all bookings by customers-------------------
# @app.route('/admin/bookings')
# @roles_required('admin')
# def admin_bookings():
#     users = User.query.all()
#     schedules = Schedule.query.all()
    
#     transactions = Transaction.query.all()
    
#     bookings = Booking.query.all()
#     customers = Customer.query.all()
#     professionals = Professional.query.all()
    
#     return render_template('admin_booking.html', bookings=bookings, schedules=schedules, transactions=transactions, customers=customers, professionals=professionals,users=users)

# @app.route('/prof/rating')
# @login_required
# def prof_byrating():
#     users = User.query.all()
#     schedules = Schedule.query.all()
    
#     transactions = Transaction.query.all()
    
#     bookings = Booking.query.all()
#     customers = Customer.query.all()
#     professionals = Professional.query.all()
    
   
#     return render_template('prof_byrating.html' , bookings=bookings, schedules=schedules, transactions=transactions, customers=customers, professionals=professionals,users=users)

