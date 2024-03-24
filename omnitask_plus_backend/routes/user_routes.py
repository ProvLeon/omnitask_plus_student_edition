from flask import Blueprint, request, jsonify
from database import session
from models.user import User
from sqlalchemy.exc import SQLAlchemyError
from routes import id_type

bp = Blueprint('user_routes', __name__, url_prefix='/users', url_defaults={'endpoint_type': id_type})

endpoint_type = ''
# Create a new user
@bp.route('/', methods=['POST'])
def create_user():
    try:
        user_data = request.json
        user = User(**user_data)
        session.add(user)
        session.commit()
        return jsonify(user.to_dict()), 201
    except SQLAlchemyError as e:
        session.rollback()
        return jsonify(error=str(e)), 400

# Get all users
@bp.route('/', methods=['GET'])
def get_users():
    users = session.query(User).all()
    return jsonify([user.to_dict() for user in users]), 200

# Get a single user by ID
@bp.route('/<{endpoint_type}:user_id>', methods=['GET'])
def get_user(user_id):
    user = session.query(User).filter(User.id == user_id).first()
    if user:
        return jsonify(user.to_dict()), 200
    else:
        return jsonify(error="User not found"), 404

# Update a user
@bp.route('/<{endpoint_type}:user_id>', methods=['PUT'])
def update_user(user_id):
    user = session.query(User).filter(User.id == user_id).first()
    if user:
        try:
            for key, value in request.json.items():
                setattr(user, key, value)
            session.commit()
            return jsonify(user.to_dict()), 200
        except SQLAlchemyError as e:
            session.rollback()
            return jsonify(error=str(e)), 400
    else:
        return jsonify(error="User not found"), 404

# Delete a user
@bp.route('/<{endpoint_type}:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = session.query(User).filter(User.id == user_id).first()
    if user:
        try:
            session.delete(user)
            session.commit()
            return jsonify(success=True), 204
        except SQLAlchemyError as e:
            session.rollback()
            return jsonify(error=str(e)), 400
    else:
        return jsonify(error="User not found"), 404
