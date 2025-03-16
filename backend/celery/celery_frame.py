from celery import Celery, Task
from flask import Flask
import backend.celery.tasks
#import db
from backend.models import db
# from flask_caching import Cache
# from backend.celery.celery_frame import celery_init_app
import flask_excel as excel   
from backend.config import Config

def create_app():
      app = Flask(__name__)
      app.config.from_object(Config)
      db.init_app(app)
      excel.init_excel(app)  # Initialize Flask-Excel
      return app

class CeleryConfig():
    broker_url = 'redis://localhost:6379/0'
    result_backend = 'redis://localhost:6379/1'
    timezone = 'Asia/Kolkata'
    include = ['backend.celery.tasks']  # Ensure tasks are included

def celery_init_app(app: Flask) -> Celery:
    class FlaskTask(Task):
        def __call__(self, *args: object, **kwargs: object):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery_app = Celery(app.name, task_cls=FlaskTask)
    celery_app.config_from_object(CeleryConfig)
    celery_app.set_default()
    app.extensions["celery"] = celery_app
    return celery_app
# Initialize Celery using a standalone Flask app (if needed)
flask_app = create_app()  
celery_app = celery_init_app(flask_app)  # Now Celery is created and ready!