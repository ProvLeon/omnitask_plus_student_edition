from flask import Blueprint, request, jsonify
from database import session
from models.task import Task
from models.base_model import base64_to_file, time_format
from sqlalchemy.exc import SQLAlchemyError
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from werkzeug.utils import secure_filename
import os


bp = Blueprint('task_routes', __name__, url_prefix='/tasks')

UPLOAD_FOLDER = '/uploads'
DOCS_FOLDER = '/uploads/docs'
IMAGES_FOLDER = '/uploads/images'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
BASE_URL = 'http://localhost:5000'

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Create a new task
@bp.route('/', methods=['POST'])
@jwt_required()  # Ensure the route is protected and requires authentication
def create_task():
    try:
        current_user_id = get_jwt_identity()  # Get the current user's ID from the JWT token
        task_data = {}

        # Create a new Task instance
        task = Task()

        task_data = request.json
        for key, value in task_data.items():
            if key == 'id':
                continue  # Skip updating the 'id' field
            if key == 'media':
                base64_url = base64_to_file(value, current_user_id)
                task_data['media'] = base64_url
                print(task_data['media'])
            setattr(task, key, value)

        # Ensure user_id is assigned
        task_data['user_id'] = current_user_id

        # Convert date strings to datetime objects
        for field in ['start_date', 'end_date']:
            if field in task_data:
                task_data[field] = datetime.strptime(task_data[field], time_format)

        print(task_data)
        # Create and save the task
        task = Task(**task_data)
        session.add(task)
        session.commit()
        return jsonify(task.to_dict()), 201
    except SQLAlchemyError as e:
        session.rollback()
        print(str(e))  # Log the error for debugging
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
    task = session.query(Task).filter(Task.id == task_id, Task.user_id == current_user_id).first()
    if task:
        try:
            if 'application/json' in request.content_type:
                task_data = request.json
            else:  # Handle form data
                task_data = request.form.to_dict()
                print(task_data)
                if 'media' in request.files:
                    file = request.files['media']
                    if file and allowed_file(file.filename):
                        extension = file.filename.rsplit('.', 1)[1].lower()
                        filename = secure_filename(f"{task.id}.{extension}")
                        if extension in ['txt', 'pdf']:
                            file_path = os.path.join(DOCS_FOLDER, filename)
                        else:
                            file_path = os.path.join(IMAGES_FOLDER, filename)
                        file.save(file_path)
                        task_data['media'] = f"{BASE_URL}{file_path}"

            if 'deadline' in task_data:
                task_data['deadline'] = datetime.strptime(task_data['deadline'], '%Y-%m-%dT%H:%M:%S')

            for key, value in task_data.items():
                setattr(task, key, value)
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
    task = session.query(Task).filter(Task.id == task_id, Task.user_id == current_user_id).first()
    if task:
        try:
            session.delete(task)
            session.commit()
            return jsonify(success=True), 204
        except SQLAlchemyError as e:
            session.rollback()
            return jsonify(error=str(e)), 400
    else:
        return jsonify(error="Task not found"), 404
