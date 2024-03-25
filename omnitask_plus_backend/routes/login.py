from flask import Blueprint, request, current_app
from database import session  # Adjust the import path according to your project structure
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask import jsonify
from models import User
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from marshmallow import Schema, fields, validate

# from app import app  # This line should be removed

bp = Blueprint('login', __name__, url_prefix='/login')



#  Initialize Rate Limiter
limiter = Limiter(app=current_app, key_func=get_remote_address)

# User Schema for validation
class UserSchema(Schema):
    username = fields.Str(required=True, validate=validate.Length(min=3))
    # email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))

# Apply rate limiting to the login route
@bp.route('/', methods=['POST'])
@limiter.limit("10 per minute")
def login_user():
    try:
        user_schema = UserSchema()
        errors = user_schema.validate(request.json)
        if errors:
            return jsonify({"error": errors}), 400

        login_data = request.json
        user = session.query(User).filter(User.username == login_data['username'].lower()).first()
        if user and user.verify_password(login_data['password']):
            access_token = create_access_token(identity=str(user.id))
            refresh_token = create_refresh_token(identity=str(user.id))
            return jsonify(access_token=access_token, refresh_token=refresh_token), 200
        else:
            return jsonify({"error": "Invalid username or password"}), 401
    except Exception as e:
        current_app.logger.error(f"Login error: {e}")
        return jsonify({"error": "An error occurred during login"}), 400

@bp.route('/token/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user_id = get_jwt_identity()
    new_token = create_access_token(identity=current_user_id)
    return jsonify(access_token=new_token), 200
