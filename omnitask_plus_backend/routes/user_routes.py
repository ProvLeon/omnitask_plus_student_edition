from flask import Blueprint, request, jsonify, current_app as app
from database import session
from models.user import User
from sqlalchemy.exc import SQLAlchemyError
from uuid import UUID
from models.schemas import UserSchema
# from datetime import datetime, timedelta
from models.base_model import time_format, base64_to_file, delete_file
# import base64

bp = Blueprint('user_routes', __name__, url_prefix='/api/users')

def check_missing_fields(user_data):
    non_nullable_fields = ['username', 'firstname', 'lastname', 'email', 'contact', 'password']
    return [field for field in non_nullable_fields if field not in user_data or not user_data[field]]

def normalize_user_data(user_data):
    user_data['username'] = user_data['username'].lower()
    user_data['email'] = user_data['email'].lower()
    user_data['firstname'] = user_data['firstname'].capitalize()
    user_data['lastname'] = user_data['lastname'].capitalize()
    user_data['middlename'] = user_data['middlename'].capitalize() if user_data.get('middlename') else ''
    user_data['contact'] = str(user_data['contact']).replace(' ', '') if user_data.get('contact') else ''
    return user_data

def check_existing_user(user_data):
    existing_email = session.query(User).filter(User.email == user_data['email']).first()
    existing_username = session.query(User).filter(User.username == user_data['username']).first()
    if existing_email or existing_username:
        if existing_email and existing_username:
            return "A user with the same email and username already exists", 409
        elif existing_email:
            return f"Email {existing_email.email} already exists", 409
        elif existing_username:
            return f"Username {existing_username.username} already exists", 409
    return None, 200  # Explicitly return 200 OK if no error

# Create a new user
@bp.route('/create', methods=['POST'])
def create_user():
    try:
        user_schema = UserSchema()
        errors = user_schema.validate(request.json)
        if errors:
            return jsonify({"error": errors}), 400

        user_data = user_schema.load(request.json)
        missing_fields = check_missing_fields(user_data)
        if missing_fields:
            return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

        user_data = normalize_user_data(user_data)
        error_message, error_code = check_existing_user(user_data)
        if error_message:
            return jsonify({"error": error_message}), error_code

        # Ensure UUID fields are correctly formatted
        if 'id' in user_data:
            try:
                user_data['id'] = str(UUID(user_data['id']))
            except ValueError:
                return jsonify({"error": "Invalid UUID format for 'id'"}), 400

        user = User(**user_data)
        session.add(user)
        session.commit()
        return jsonify(user.to_dict()), 201
    except SQLAlchemyError as e:
        session.rollback()
        app.logger.error(f"Failed to create user: {e} (user_data={user_data})")
        return jsonify(error=str(e)), 400

# Get all users
@bp.route('/getusers', methods=['GET'])
def get_users():
    try:
        users = session.query(User).all()
        return jsonify([user.to_dict() for user in users]), 200
    except Exception as e:
        app.logger.error(f"Error fetching users: {e}")
        return jsonify(error=str(e)), 400

# Fetch a user by username or email
@bp.route('/', methods=['GET'])
def fetch_user_by_username_or_email():
    username = request.args.get('username')
    email = request.args.get('email')
    try:
        if username:
            user = session.query(User).filter(User.username == username).first()
        elif email:
            user = session.query(User).filter(User.email == email).first()
        else:
            return jsonify(error="Username or Email parameter is required"), 400

        if user:
            return jsonify(user.to_dict()), 200
        else:
            return jsonify(error="User not found"), 404
    except Exception as e:
        app.logger.error(f"Error fetching user: {e}")
        return jsonify(error=str(e)), 400

# Get a single user by ID
@bp.route('/getuser/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user_id_uuid = UUID(user_id)
        user = session.query(User).filter(User.id == user_id_uuid).first()
        if user:
            return jsonify(user.to_dict()), 200
        else:
            return jsonify(error="User not found"), 404
    except ValueError:
        return jsonify(error="Invalid UUID format"), 400

# Update a user
@bp.route('/update/<user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        user_id_uuid = UUID(user_id)
        user = session.query(User).filter(User.id == user_id_uuid).first()
        if not user:
            return jsonify(error="User not found"), 404

        user_data = request.json
        if not isinstance(user_data, dict):  # Ensure user_data is a dictionary
            return jsonify({"error": "Invalid data format. Expected a JSON object."}), 400

        for key, value in user_data.items():
            if key == 'id':
                continue  # Skip updating the 'id' field
            if key == 'image':
                if user.image:
                    delete_file(user.image)
                value = base64_to_file(value, user_id_uuid)
            setattr(user, key, value)

        session.commit()
        return jsonify(user.to_dict()), 200
    except SQLAlchemyError as e:
        session.rollback()
        app.logger.error(f"Failed to update user: {e}")
        return jsonify(error=str(e)), 400

# # Check if a user is online
# @bp.route('/<user_id>/online-status', methods=['GET'])
# def check_user_online_status(user_id):
#     try:
#         user_id_uuid = UUID(user_id)
#         user = session.query(User).filter(User.id == user_id_uuid).first()
#         if user:
#             # Check if user_id is in the active session
#             if flask_session.get('active_users') and user.username in flask_session['active_users']:
#                 return jsonify({"online": True}), 200
#             else:
#                 return jsonify({"online": False}), 200
#         else:
#             return jsonify(error="User not found"), 404
#     except ValueError:
#         return jsonify(error="Invalid UUID format"), 400

# @bp.route('/<user_id>/start-session', methods=['POST'])
# def start_user_session(user_id):
#     try:
#         user_id_uuid = UUID(user_id)
#         user = session.query(User).filter(User.id == user_id_uuid).first()
#         if user:
#             if 'active_users' not in flask_session:
#                 flask_session['active_users'] = []
#             flask_session['active_users'].append(user.username)
#             flask_session.modified = True
#             return jsonify({"message": "User session started"}), 200
#         else:
#             return jsonify(error="User not found"), 404
#     except ValueError:
#         return jsonify(error="Invalid UUID format"), 400

# @bp.route('/<user_id>/end-session', methods=['POST'])
# def end_user_session(user_id):
#     try:
#         user_id_uuid = UUID(user_id)
#         user = session.query(User).filter(User.id == user_id_uuid).first()
#         if 'active_users' in flask_session and user.username in flask_session['active_users']:
#             flask_session['active_users'].remove(user.username)
#             flask_session.modified = True
#             return jsonify({"message": "User session ended"}), 200
#         else:
#             return jsonify({"error": "User session not found"}), 404
#     except Exception as e:
#         app.logger.error(f"Failed to end user session: {e}")
#         return jsonify(error=str(e)), 400
