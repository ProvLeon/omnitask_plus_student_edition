from flask import Flask, jsonify
from dotenv import load_dotenv
import os
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from database import init_db
from utils.extensions import mail
# from routes.chat_routes import init_socketio

load_dotenv()
# def create_app():
app = Flask(__name__)


app.config['BACKEND_URL'] = os.getenv('BACKEND_URL')
app.config['STREAM_CHAT_API_KEY'] = os.getenv('STREAM_CHAT_API_KEY')
app.config['STREAM_CHAT_SECRETE'] = os.getenv('STREAM_CHAT_SECRETE')
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = os.getenv('MAIL_PORT')
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS')
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['JWT_SECRET_KEY'] = os.urandom(24).hex()

# mail = Mail(app)
mail.init_app(app)

# Generate a random secret key
app.secret_key = os.urandom(24).hex()
jwt = JWTManager(app)

# Initialize CORS
CORS(app)

@app.before_request
def initialize_database():
    init_db()

# Import and register blueprints inside the factory function
from routes.user_routes import bp as user_routes_bp
from routes.task_routes import bp as task_routes_bp
from routes.study_sessions_routes import bp as study_sessions_routes_bp
from routes.login import bp as login_bp
from routes.files_route import bp as files_route_bp
# from routes.chat_routes import chat_bp as chat_route_bp
from routes.stream_chat_api import stream_chat_bp as stream_chat_api_bp
from routes.passwordrecovery import bp as passwordrecovery_bp
app.register_blueprint(user_routes_bp)
app.register_blueprint(task_routes_bp)
app.register_blueprint(study_sessions_routes_bp)
app.register_blueprint(login_bp)
app.register_blueprint(files_route_bp)
app.register_blueprint(passwordrecovery_bp)
# app.register_blueprint(chat_route_bp)
app.register_blueprint(stream_chat_api_bp)


# return app
@jwt.expired_token_loader
def my_expired_token_callback(jwt_header, jwt_payload):
    return jsonify({"error": "Token has expired"}), 401

if __name__ == '__main__':
    # app = create_app()
    # init_socketio(app)
    app.run()
