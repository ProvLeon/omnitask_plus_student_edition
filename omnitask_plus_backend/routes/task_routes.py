from flask import Blueprint, request, jsonify
from database import session
from models.task import Task
from sqlalchemy.exc import SQLAlchemyError
from utils.json_utils import to_dict

# from models import id_type

bp = Blueprint('task_routes', __name__, url_prefix='/tasks')

# Create a new task
@bp.route('/', methods=['POST'])
def create_task():
    try:
        task_data = request.json
        task = Task(**task_data)
        session.add(task)
        session.commit()
        return jsonify(task.to_dict()), 201
    except SQLAlchemyError as e:
        session.rollback()
        return jsonify(error=str(e)), 400

# Get all tasks
@bp.route('/', methods=['GET'])
def get_tasks():
    tasks = session.query(Task).all()
    return jsonify([task.to_dict() for task in tasks]), 200

# Get a single task by ID
@bp.route('/<task_id>', methods=['GET'])
def get_task(task_id):
    task = session.query(Task).filter(Task.id == task_id).first()
    if task:
        return jsonify(task.to_dict()), 200
    else:
        return jsonify(error="Task not found"), 404

# Update a task
@bp.route('/<task_id>', methods=['PUT'])
def update_task(task_id):
    task = session.query(Task).filter(Task.id == task_id).first()
    if task:
        try:
            for key, value in request.json.items():
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
def delete_task(task_id):
    task = session.query(Task).filter(Task.id == task_id).first()
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
