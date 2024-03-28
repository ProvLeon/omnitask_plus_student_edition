from flask import Blueprint, send_from_directory, current_app as app
import os

bp = Blueprint('files_route', __name__, url_prefix='/api/files')

@bp.route('/images/<filename>', methods=['GET'])
def get_image(filename):
    directory = os.path.join(app.root_path, 'uploads/images')
    return send_from_directory(directory, filename)

@bp.route('/docs/<filename>', methods=['GET'])
def get_document(filename):
    directory = os.path.join(app.root_path, 'uploads/docs')
    return send_from_directory(directory, filename)
