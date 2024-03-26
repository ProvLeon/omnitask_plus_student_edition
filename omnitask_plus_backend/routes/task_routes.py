from flask import Blueprint, request, jsonify
from database import session
from models.task import Task
from models.base_model import time_format
from sqlalchemy.exc import SQLAlchemyError
from utils.json_utils import to_dict
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
import base64

bp = Blueprint('task_routes', __name__, url_prefix='/tasks')

# Create a new task
@bp.route('/', methods=['POST'])
@jwt_required()  # Ensure the route is protected and requires authentication
def create_task():
    try:
        current_user_id = get_jwt_identity()  # Get the current user's ID from the JWT token
        task_data = request.json
        task_data['user_id'] = current_user_id  # Assign the current user's ID to the task

        # Convert deadline from string to datetime object
        # if 'deadline' in task_data:
        #     task_data['deadline'] = datetime.strptime(task_data['deadline'], time_format)

        if 'start_date' in task_data:
            task_data['start_date'] = datetime.strptime(task_data['start_date'], time_format)

        if 'end_date' in task_data:
            task_data['end_date'] = datetime.strptime(task_data['end_date'], time_format)

        # Convert media from base64 string to bytes
        if 'media' in task_data and task_data['media'] is not None:
            task_data['media'] = base64.b64decode(task_data['media'])

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
    task = session.query(Task).filter(Task.id == task_id, Task.user_id == current_user_id).first()
    if task:
        try:
            task_data = request.json
            # Convert deadline from string to datetime object
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
