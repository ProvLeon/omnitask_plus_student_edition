from flask import Blueprint, request, jsonify
from database import session
from models.study_session import StudySession
from sqlalchemy.exc import SQLAlchemyError
from routes import id_type

bp = Blueprint('study_session_routes', __name__, url_prefix='/study_sessions', url_defaults={'endpoint_type': id_type})

# Create a new study session
@bp.route('/', methods=['POST'])
def create_study_session():
    try:
        study_session_data = request.json
        study_session = StudySession(**study_session_data)
        session.add(study_session)
        session.commit()
        return jsonify(study_session.to_dict()), 201
    except SQLAlchemyError as e:
        session.rollback()
        return jsonify(error=str(e)), 400

# Get all study sessions
@bp.route('/', methods=['GET'])
def get_study_sessions():
    study_sessions = session.query(StudySession).all()
    return jsonify([study_session.to_dict() for study_session in study_sessions]), 200

# Get a single study session by ID
@bp.route('/<{endpoint_type}:study_session_id>', methods=['GET'])
def get_study_session(study_session_id):
    study_session = session.query(StudySession).filter(StudySession.id == study_session_id).first()
    if study_session:
        return jsonify(study_session.to_dict()), 200
    else:
        return jsonify(error="Study session not found"), 404

# Update a study session
@bp.route('/<{endpoint_type}:study_session_id>', methods=['PUT'])
def update_study_session(study_session_id):
    study_session = session.query(StudySession).filter(StudySession.id == study_session_id).first()
    if study_session:
        try:
            for key, value in request.json.items():
                setattr(study_session, key, value)
            session.commit()
            return jsonify(study_session.to_dict()), 200
        except SQLAlchemyError as e:
            session.rollback()
            return jsonify(error=str(e)), 400
    else:
        return jsonify(error="Study session not found"), 404

# Delete a study session
@bp.route('/<{endpoint_type}:study_session_id>', methods=['DELETE'])
def delete_study_session(study_session_id):
    study_session = session.query(StudySession).filter(StudySession.id == study_session_id).first()
    if study_session:
        try:
            session.delete(study_session)
            session.commit()
            return jsonify(success=True), 204
        except SQLAlchemyError as e:
            session.rollback()
            return jsonify(error=str(e)), 400
    else:
        return jsonify(error="Study session not found"), 404
