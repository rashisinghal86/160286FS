import os

class Config:
    # General Configurations
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your_secret_key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///your_database.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECURITY_PASSWORD_SALT = 'super-secret-salt'  # Add this line
    WTF_CSRF_ENABLED = True  # Enable CSRF protection
    
    # Flask-Security Configurations
    SECURITY_PASSWORD_SALT = os.environ.get('SECURITY_PASSWORD_SALT') or 'your_password_salt'
    SECURITY_REGISTERABLE = True
    SECURITY_SEND_REGISTER_EMAIL = False
    SECURITY_RECOVERABLE = True
    SECURITY_TRACKABLE = True
    SECURITY_PASSWORD_HASH = 'bcrypt'
    SECURITY_CONFIRMABLE = True
    SECURITY_CHANGEABLE = True

    # Token Authentication Configurations (NEW)
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authentication-Token'
    SECURITY_TOKEN_MAX_AGE = 3600  # Token expires in 1 hour
    SECURITY_API_ENABLED_METHODS = ['POST']  # Enables API-based authentication
    SECURITY_TOKEN_AUTHENTICATION_KEY = 'token'
    SECURITY_LOGIN_URL = '/api/login'
    SECURITY_LOGIN_WITHOUT_CONFIRMATION = True  # Allow login without email confirmation

    # Email Configurations (if using email confirmation)
    MAIL_SERVER = 'smtp.example.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME') or 'your_email@example.com'
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD') or 'your_email_password'
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER') or 'your_email@example.com'

    # Cache Configurations
    CACHE_TYPE = 'simple'  # Use simple in-memory cache
    CACHE_DEFAULT_TIMEOUT = 300  # Cache timeout in seconds
    CACHE_REDIS_PORT = 6379

    