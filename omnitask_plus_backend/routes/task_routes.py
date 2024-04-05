from flask import Blueprint, request, jsonify
from database import session
from models.task import Task
from models.base_model import base64_to_file, delete_file, reformat_date, time_format
from sqlalchemy.exc import SQLAlchemyError
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from werkzeug.utils import secure_filename
from urllib.parse import urlparse
import uuid
import os


bp = Blueprint('task_routes', __name__, url_prefix='/tasks')

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
BASE_URL = 'http://localhost:5000'

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def convert_to_uuid(id):
    try:
        return str(uuid.UUID(id))
    except ValueError:
        return None

# Create a new task
@bp.route('/', methods=['POST'])
@jwt_required()  # Ensure the route is protected and requires authentication
def create_task():
    try:
        current_user_id = get_jwt_identity()  # Get the current user's ID from the JWT token
        task_data = request.json
        task_data['user_id'] = current_user_id

        # Convert date strings to datetime objects and handle media
        for key, value in task_data.items():
            if key in ['start_date', 'end_date']:
                print(key, value)
                task_data[key] = reformat_date(value)
                print(task_data[key])
            elif key == 'media' and value:
                task_data['media'] = base64_to_file(value, current_user_id)

        # Create and save the task
        task = Task(**task_data)
        session.add(task)
        session.commit()
        return jsonify(task.to_dict()), 201
    except SQLAlchemyError as e:
        session.rollback()
        return jsonify(error=str(e)), 400

@bp.route('/', methods=['GET'])
@jwt_required()
def get_tasks():
    current_user_id = get_jwt_identity()
    tasks = session.query(Task).filter(Task.user_id == current_user_id).all()
    return jsonify([task.to_dict() for task in tasks]), 200

# Get a single task by ID
@bp.route('/<task_id>', methods=['GET'])
@jwt_required()
def get_task(task_id):
    current_user_id = get_jwt_identity()
    task = session.query(Task).filter(Task.id == task_id, Task.user_id == current_user_id).first()
    if task:
        return jsonify(task.to_dict()), 200
    else:
        return jsonify(error="Task not found"), 404

# Update a task
@bp.route('/<task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    current_user_id = get_jwt_identity()
    task_id = uuid.UUID(task_id)
    task = session.query(Task).filter(Task.id == task_id, Task.user_id == current_user_id).first()
    print(request.json)
    if task:
        print(request.json)
        try:
            task_data = request.json
            print(task_data)
            if 'media' in request.files and allowed_file(request.files['media'].filename):
                task_data['media'] = base64_to_file(request.files['media'], current_user_id)

            for key, value in task_data.items():
                if key == 'updated_at':
                    value = reformat_date(value)
                setattr(task, key, value)
            print(task.updated_at, "trying again")
            session.commit()
            return jsonify(task.to_dict()), 200
        except SQLAlchemyError as e:
            session.rollback()
            return jsonify(error=str(e)), 400
    else:
        return jsonify(error="Task not found"), 404

# Delete a task
@bp.route('/<task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    current_user_id = get_jwt_identity()
    task_id = uuid.UUID(task_id)
    task = session.query(Task).filter(Task.id == task_id, Task.user_id == current_user_id).first()
    if task:
        try:
            # Attempt to delete the associated media file
            if task.media:
                delete_file(task.media)

            session.delete(task)
            session.commit()
            return jsonify(success=True), 204
        except SQLAlchemyError as e:
            session.rollback()
            return jsonify(error=str(e)), 400
        except OSError as os_error:
            return jsonify(error=f"Failed to delete media file: {os_error}"), 400
    else:
        return jsonify(error="Task not found"), 404

@bp.route('/<task_id>/status', methods=['PUT'])
@jwt_required()
def update_task_progress(task_id):
    current_user_id = get_jwt_identity()
    task_id = uuid.UUID(task_id)
    task = session.query(Task).filter(Task.id == task_id, Task.user_id == current_user_id).first()
    if task:
        task.status = request.json['status']
        session.commit()
        return jsonify(task.to_dict()), 200
    else:
        return jsonify(error="Task not found"), 404


@bp.route('/<task_id>/<attribute>', methods=['PUT'])
@jwt_required()
def update_task_attribute(task_id, attribute):
    current_user_id = get_jwt_identity()
    task_id = uuid.UUID(task_id)
    task = session.query(Task).filter(Task.id == task_id, Task.user_id == current_user_id).first()
    if task:
        setattr(task, attribute, request.json['value'])
        session.commit()
        return jsonify(task.to_dict()), 200
    else:
        return jsonify(error="Task not found"), 404

