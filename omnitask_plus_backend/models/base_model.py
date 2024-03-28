from sqlalchemy import create_engine, Column, Integer, DateTime, String  # Add DateTime to the import
from sqlalchemy import create_engine, Column, Integer, DateTime, String
from sqlalchemy.orm import sessionmaker
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.inspection import inspect
from datetime import datetime
import uuid
import base64
import os
from PIL import Image
import io
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
        if kwargs:
            for key, value in kwargs.items():
                if key != "__class__":
                    setattr(self, key, value)
            if kwargs.get("created_at", None) and isinstance(self.created_at, str):
                self.created_at = datetime.strptime(kwargs["created_at"], time_format)
            else:
                self.created_at = datetime.utcnow()
            if kwargs.get("updated_at", None) and isinstance(self.updated_at, str):
                self.updated_at = datetime.strptime(kwargs["updated_at"], time_format)
            else:
                self.updated_at = datetime.utcnow()

            if 'id' not in kwargs:
                self.id = uuid.uuid4()

        else:
            self.id = uuid.uuid4()
            self.created_at = datetime.utcnow()
            self.updated_at = self.created_at

    def to_dict(self):
        model_dict = {}
        for c in inspect(self).mapper.column_attrs:
            value = getattr(self, c.key)
            model_dict[c.key] = value
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
    if 'image' in mime_type:
        directory = 'uploads/images'
        file_extension = mimetypes.guess_extension(mime_type)
    elif 'application' in mime_type or 'text' in mime_type:
        directory = 'uploads/docs'
        file_extension = mimetypes.guess_extension(mime_type)
    else:
        raise ValueError("Unsupported file type")

    # Ensure the directory exists
    if not os.path.exists(directory):
        os.makedirs(directory)

    file_path = f'{directory}/{file_name}{file_extension}'
    with open(file_path, 'wb') as file:
        file.write(data)

    # Assuming the server is configured to serve files from 'uploads/' at '/uploads/'
    BASE_URL = current_app.config['BASE_URL']
    return f'{BASE_URL}/api/files/{file_path.strip("uploads/")}'
