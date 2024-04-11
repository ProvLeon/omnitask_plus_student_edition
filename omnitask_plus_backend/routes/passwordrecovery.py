from flask import Flask, Blueprint, request, jsonify
from database import session
from models.user import User
from werkzeug.security import generate_password_hash
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from flask_mail import Message
from utils.extensions import mail
import os
# from app import mail

bp = Blueprint('password_recovery', __name__, url_prefix='/users')

# Initialize Flask-Mail

# Serializer for generating and confirming tokens
serializer = URLSafeTimedSerializer('ThisIsASecret!')

# Store the frontend link in a variable
frontend_url = os.getenv('FRONTEND_URL')

@bp.route('/request-password-recovery', methods=['POST'])
def request_password_recovery():
    """
    Handles the request for password recovery. It generates a token for the user's email,
    creates a recovery link, and sends it to the user's email.
    """
    email = request.json.get('email')
    user = session.query(User).filter_by(email=email).first()
    if not user:
        return jsonify({"error": "Email not found"}), 404

    token = serializer.dumps(email, salt='recover-password')
    recovery_link = f'{frontend_url}/recover-password/{token}'

    # Send recovery email
    msg = Message('Password Recovery Request', sender='leoTech-digital@gmail.com', recipients=[email])
    msg.body = f"""Hello,

You recently requested to reset your password for your OmniTask+ account. Use the link below to reset it. This password reset is only valid for the next 60 minutes.

{recovery_link}

If you did not request a password reset, please ignore this email or contact support if you have questions.

Thanks,
The OmniTask+ Team"""
    mail.send(msg)

    return jsonify({"message": "Password recovery email sent"}), 200

@bp.route('/reset-password', methods=['POST'])
def reset_password():
    """
    Resets the user's password. It verifies the token received from the user,
    and if valid, updates the user's password in the database.
    """
    token = request.json.get('token')
    new_password = request.json.get('newPassword')
    try:
        email = serializer.loads(token, salt='recover-password', max_age=3600)
    except (SignatureExpired, BadSignature):
        return jsonify({"error": "The password recovery link is invalid or has expired"}), 400

    user = session.query(User).filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.password_hash = generate_password_hash(new_password)
    session.commit()

    return jsonify({"message": "Password has been reset successfully"}), 200
