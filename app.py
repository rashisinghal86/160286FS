from flask import Flask
from flask_cors import CORS

from flask_security import Security, SQLAlchemyUserDatastore
from extensions import db
from backend.models import User, Role, add_roles, create_default_admin
from flask_caching import Cache
import flask_excel as excel
from backend.celery_init import celery_init_app



# Initialize the Flask application
# app = Flask(__name__)
app = Flask(__name__,static_folder="frontend", template_folder="frontend", static_url_path='/static')
CORS(app)
#app.config.from_object('config.Config')

app.config.from_object('backend.config.Config')


# Initialize the database
db.init_app(app)

# Initialize the cache
cache = Cache(app)

# Setup Flask-Security
user_datastore = SQLAlchemyUserDatastore(db, User, Role)
app.cache = cache
security = Security(app, user_datastore, register_blueprint=False)

# Initialize Celery
celery = celery_init_app(app)  # Ensure Celery is properly initialized

# Create the database tables and default data
with app.app_context():
    db.create_all()  # Ensure tables are created
    add_roles()      # Add default roles
    create_default_admin()  # Create a default admin user

# Import backend.routes after app setup
import backend.routes

#flask-excel
excel.init_excel(app)

if __name__ == '__main__':
    app.run(debug=True)