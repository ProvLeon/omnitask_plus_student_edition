from sqlalchemy import create_engine, Column, Integer, DateTime, String
from sqlalchemy.orm import sessionmaker
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.inspection import inspect
from datetime import datetime
import uuid
import base64
import os
import mimetypes
from flask import current_app

Base = declarative_base()

time_format = "%Y-%m-%dT%H:%M:%S.%fZ"

class BaseModel(Base):
    __abstract__ = True
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)  # Simplified constructor with super call
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def to_dict(self):
        model_dict = {c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs}
        return model_dict

def base64_to_string(image_bytes):
    return base64.b64encode(image_bytes).decode('utf-8')

def base64_to_bytes(image_base64_string):
    return base64.b64decode(image_base64_string)

def base64_to_file(base64_string, file_name):
    # Decode the base64 string to get the MIME type and data
    header, encoded = base64_string.split(",", 1)
    data = base64.b64decode(encoded)
    mime_type = header.split(';')[0].split(':')[1]

    # Determine the directory and file extension based on MIME type
    directory = 'uploads'
    if 'image' in mime_type:
        directory = os.path.join(directory, 'images')
    elif 'application' in mime_type or 'text' in mime_type:
        directory = os.path.join(directory, 'docs')
    else:
        raise ValueError("Unsupported file type")

    file_extension = mimetypes.guess_extension(mime_type)
    if not file_extension:
        raise ValueError("Could not determine file extension")

    # Ensure the directory exists
    os.makedirs(directory, exist_ok=True)

    # Generate a unique file name to avoid collisions
    unique_file_name = f"{file_name}_{uuid.uuid4().hex}{file_extension}"
    file_path = os.path.join(directory, unique_file_name)

    # Save the decoded data to a file
    with open(file_path, 'wb') as file:
        file.write(data)

    # Assuming the server is configured to serve files from 'uploads/' at '/uploads/'
    BASE_URL = current_app.config['BASE_URL']
    return f'{BASE_URL}/api/files/{os.path.relpath(file_path, start="uploads/")}'
