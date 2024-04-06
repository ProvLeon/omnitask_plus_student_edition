from flask import Flask, jsonify
import os
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from database import init_db
from routes.chat_routes import init_socketio

# def create_app():
app = Flask(__name__)

app.config['BASE_URL'] = 'http://localhost:5000'

# Generate a random secret key
app.config['JWT_SECRET_KEY'] = os.urandom(24).hex()
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
from routes.chat_routes import chat_bp as chat_route_bp
app.register_blueprint(user_routes_bp)
app.register_blueprint(task_routes_bp)
app.register_blueprint(study_sessions_routes_bp)
app.register_blueprint(login_bp)
app.register_blueprint(files_route_bp)
app.register_blueprint(chat_route_bp)


# return app
@jwt.expired_token_loader
def my_expired_token_callback(jwt_header, jwt_payload):
    return jsonify({"error": "Token has expired"}), 401

if __name__ == '__main__':
    # app = create_app()
    init_socketio(app)
    app.run()
