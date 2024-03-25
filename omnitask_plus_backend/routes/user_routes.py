from flask import Blueprint, request, jsonify, current_app as app
from database import session
from models.user import User
from sqlalchemy.exc import SQLAlchemyError
from uuid import UUID
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from models.schemas import UserSchema

bp = Blueprint('user_routes', __name__, url_prefix='/users')



def check_missing_fields(user_data):
    non_nullable_fields = ['username', 'firstname', 'lastname', 'email', 'contact', 'password']
    return [field for field in non_nullable_fields if field not in user_data or not user_data[field]]

def normalize_user_data(user_data):
    user_data['username'] = user_data['username'].lower()
    user_data['email'] = user_data['email'].lower()
    user_data['firstname'] = user_data['firstname'].capitalize()
    user_data['lastname'] = user_data['lastname'].capitalize()
    user_data['middlename'] = user_data['middlename'].capitalize() if user_data.get('middlename') else ''
    return user_data

def check_existing_user(user_data):
    existing_email = session.query(User).filter(User.email == user_data['email']).first()
    existing_username = session.query(User).filter(User.username == user_data['username']).first()
    if existing_email or existing_username:
        if existing_email and existing_username:
            return "A user with the same email or username already exists", 409
        if existing_email:
            return f"Email {existing_email.email} already exists", 409
        if existing_username:
            return f"Username {existing_username.username} already exists", 409
    return None, None

# Create a new user
@bp.route('/', methods=['POST'])
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

        user = User(**user_data)
        session.add(user)
        session.commit()
        return jsonify(user.to_dict()), 201
    except SQLAlchemyError as e:
        session.rollback()
        app.logger.error(f"Failed to create user: {e} (user_data={user_data})")
        return jsonify(error=str(e)), 400

# Get all users
@bp.route('/', methods=['GET'])
def get_users():
    try:
        users = session.query(User).all()
        return jsonify([user.to_dict() for user in users]), 200
    except Exception as e:
        app.logger.error(f"Error fetching users: {e}")
        return jsonify(error=str(e)), 400

# Get a single user by ID
@bp.route('/<user_id>', methods=['GET'])
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
@bp.route('/<user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        user_id_uuid = UUID(user_id)
        user = session.query(User).filter(User.id == user_id_uuid).first()
        if user:
            for key, value in request.json.items():
                setattr(user, key, value)
            session.commit()
            return jsonify(user.to_dict()), 200
        else:
            return jsonify(error="User not found"), 404
    except ValueError:
        return jsonify(error="Invalid UUID format"), 400

# Delete a user
@bp.route('/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        user_id_uuid = UUID(user_id)
        user = session.query(User).filter(User.id == user_id_uuid).first()
        if user:
            session.delete(user)
            session.commit()
            return jsonify(success=True), 204
        else:
            return jsonify(error="User not found"), 404
    except ValueError:
        return jsonify(error="Invalid UUID format"), 400

