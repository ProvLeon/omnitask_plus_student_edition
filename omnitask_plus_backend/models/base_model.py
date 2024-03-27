from sqlalchemy import create_engine, Column, Integer, DateTime, String  # Add DateTime to the import
from sqlalchemy.orm import sessionmaker
from sqlalchemy.dialects.postgresql import UUID  # Use this for PostgreSQL
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.inspection import inspect
from datetime import datetime
import uuid
import base64
import binascii  # Add this import at the top of your file

Base = declarative_base()

time_format = "%Y-%m-%dT%H:%M:%S.%fZ"

class BaseModel(Base):
    __abstract__ = True  # Declares this as a Base class for other models to inherit from
    # id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)  # Adjusted for UUID
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __init__(self, *args, **kwargs):
        """Initialization of the base model"""
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
                self.id = uuid.uuid4()  # No need to convert to string here; SQLAlchemy handles it.

        else:
            self.id = uuid.uuid4()
            self.created_at = datetime.utcnow()
            self.updated_at = self.created_at

    def to_dict(self):
        """Return a dictionary representation of the model, encoding bytes fields to base64."""
        model_dict = {}
        for c in inspect(self).mapper.column_attrs:
            value = getattr(self, c.key)
            model_dict[c.key] = value
        return model_dict

def to_base64(value):
    if isinstance(value, bytes):
        try:
            image_data = value.split(',')[1]
            return base64.b64encode(image_data), image_data
        except binascii.Error as e:
            print(f"Error encoding base64 string: {e}")
            return None
    else:
        raise TypeError("Value must be bytes")
