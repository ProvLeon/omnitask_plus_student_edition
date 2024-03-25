from sqlalchemy import create_engine, Column, Integer, DateTime, String  # Add DateTime to the import
from sqlalchemy.orm import sessionmaker
from sqlalchemy.dialects.postgresql import UUID  # Use this for PostgreSQL
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.inspection import inspect
from datetime import datetime
import uuid

Base = declarative_base()

time = "%Y-%m-%dT%H:%M:%S.%f"

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
                self.created_at = datetime.strptime(kwargs["created_at"], time)
            else:
                self.created_at = datetime.utcnow()
            if kwargs.get("updated_at", None) and isinstance(self.updated_at, str):
                self.updated_at = datetime.strptime(kwargs["updated_at"], time)
            else:
                self.updated_at = datetime.utcnow()

            if 'id' not in kwargs:
                self.id = uuid.uuid4()  # No need to convert to string here; SQLAlchemy handles it.

        else:
            self.id = uuid.uuid4()
            self.created_at = datetime.utcnow()
            self.updated_at = self.created_at

    def to_dict(self):
        """Return a dictionary representation of the user model."""
        return {c.key: getattr(self, c.key)
                for c in inspect(self).mapper.column_attrs}
