from flask import Blueprint, request, jsonify
from database import session
from models.task import Task
from models.user import User  # Import User model to query persons responsible
from models.base_model import base64_to_file, delete_file, reformat_date, time_format
from sqlalchemy.exc import SQLAlchemyError
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename
from urllib.parse import urlparse
import uuid
import os
from sqlalchemy.orm import joinedload
from sqlalchemy import func, extract, case


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
                task_data[key] = reformat_date(value)
            elif key == 'media' and value:
                task_data['media'] = base64_to_file(value, current_user_id)

            # Adjusting persons responsible to accept a list of user IDs directly
        if 'persons_responsible' in task_data:
            try:
                # Convert each ID to a UUID object
                persons_responsible_ids = [uuid.UUID(user['id']) for user in task_data['persons_responsible']]
            except ValueError:
                # Handle the case where ID conversion fails
                return jsonify(error="Invalid user ID format in persons responsible"), 400

        # Query the User model to get user objects based on the provided IDs
            task_data['persons_responsible'] = session.query(User).filter(User.id.in_(persons_responsible_ids)).all()
        else:
            # If not a list or empty, set to an empty list
            task_data['persons_responsible'] = []

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
    tasks = session.query(Task).options(joinedload(Task.persons_responsible)).filter(Task.user_id == current_user_id).all()
    try:
        if tasks:
            tasks_dict = [task.to_dict() for task in tasks]
            for task_dict, task in zip(tasks_dict, tasks):
                task_dict['persons_responsible'] = [user.to_dict()['id'] for user in task.persons_responsible]
            return jsonify(tasks_dict), 200
        else:
            return jsonify("No Tasks Created Yet"), 200
    except Exception as e:
        return jsonify(error=str(e)), 400

# Get a single task by ID
@bp.route('/<task_id>', methods=['GET'])
@jwt_required()
def get_task(task_id):
    current_user_id = get_jwt_identity()
    # Use joinedload to load the persons_responsible relationship
    task = session.query(Task).options(joinedload(Task.persons_responsible)).filter(Task.id == task_id, Task.user_id == current_user_id).first()
    if task:
        # Convert the task and its relationships to a dictionary
        task_dict = task.to_dict()
        # Include persons_responsible in the response
        task_dict['persons_responsible'] = [user.to_dict()['id'] for user in task.persons_responsible]
        print(task_dict)
        return jsonify(task_dict), 200
    else:
        return jsonify(error="Task not found"), 404

# Update a task
@bp.route('/<task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    current_user_id = get_jwt_identity()
    task_id = uuid.UUID(task_id)
    task = session.query(Task).filter(Task.id == task_id, Task.user_id == current_user_id).first()
    if task:
        try:
            task_data = request.json
            print(task_data)
            if 'media' in request.files and allowed_file(request.files['media'].filename):
                task_data['media'] = base64_to_file(request.files['media'], current_user_id)

            # Convert date strings to datetime objects for start_date and end_date
            if 'start_date' in task_data:
                task_data['start_date'] = reformat_date(task_data['start_date'])
            if 'end_date' in task_data:
                task_data['end_date'] = reformat_date(task_data['end_date'])

            # Update persons responsible with the provided list of user objects
            if 'persons_responsible' in task_data:
                persons_responsible_ids = [user['id'] for user in task_data['persons_responsible']]
                print(persons_responsible_ids)
                task.persons_responsible = session.query(User).filter(User.id.in_(persons_responsible_ids)).all()

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
        if attribute == 'persons_responsible':
            try:
                # Update persons responsible with the provided list of user objects
                persons_responsible_ids = [uuid.UUID(id) for id in request.json['value']]
                task.persons_responsible = session.query(User).filter(User.id.in_(persons_responsible_ids)).all()
                # return jsonify(persons_responsible_ids), 200
            except Exception as e:
                return jsonify(error=f"{e} Invalid data format for persons responsible{persons_responsible_ids}"), 400
        else:
            setattr(task, attribute, request.json['value'])
        session.commit()
        return jsonify(task.to_dict()), 200
    else:
        return jsonify(error="Task not found"), 404

@bp.route('/priority_trends', methods=['GET'])
@jwt_required()
def get_priority_trends():
    try:
        # Grouping priority trends as high, medium, and low
        priority_trends = session.query(
            Task.priority,
            func.count(Task.id).label('count')
        ).group_by(Task.priority).all()

        # Mapping priorities to high, medium, and low
        priority_mapping = {"high": 0, "medium": 0, "low": 0}
        for priority, count in priority_trends:
            if priority in priority_mapping:
                priority_mapping[priority] += count

        priority_trends_data = [{"priority": key, "count": value} for key, value in priority_mapping.items()]
        return jsonify(priority_trends_data), 200
    except Exception as e:
        return jsonify(error=str(e)), 500

@bp.route('/activity_trends', methods=['GET'])
@jwt_required()
def get_activity_trends():
    try:
        twelve_months_ago = datetime.now() - timedelta(days=365)
        # Query to get the total number of tasks and the number of tasks done per month
        trends = session.query(
            extract('month', Task.start_date).label('month'),
            func.count(Task.id).label('total_tasks'),
            func.sum(case((Task.status == 'done', 1), else_=0)).label('tasks_done')
        ).filter(Task.start_date >= twelve_months_ago).group_by('month').all()

        # Preparing the data for response
        trends_data = [{"month": datetime(1900, month, 1).strftime('%b'), "total_tasks": total_tasks, "tasks_done": tasks_done} for month, total_tasks, tasks_done in trends]
        return jsonify(trends_data), 200
    except Exception as e:
        return jsonify(error=str(e)), 500

@bp.route('/progress_trends', methods=['GET'])
@jwt_required()
def get_progress_trends():
    try:
        twelve_months_ago = datetime.now() - timedelta(days=365)
        progress_trends = session.query(
            extract('month', Task.start_date).label('month'),
            func.count(Task.id).label('total'),
            func.sum(case((Task.status == 'todo', 1), else_=0)).label('todo'),
            func.sum(case((Task.status == 'in progress', 1), else_=0)).label('in_progress'),
            func.sum(case((Task.status == 'done', 1), else_=0)).label('done')
        ).filter(Task.start_date >= twelve_months_ago).group_by('month').all()

        progress_trends_data = [{"month": datetime(1900, month, 1).strftime('%b'), "total": total, "todo": todo, "in_progress": in_progress, "done": done} for month, total, todo, in_progress, done in progress_trends]
        return jsonify(progress_trends_data), 200
    except Exception as e:
        return jsonify(error=str(e)), 500
