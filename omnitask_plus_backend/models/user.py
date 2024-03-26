from sqlalchemy import Column, Integer, String, DateTime, LargeBinary, Boolean, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base
from werkzeug.security import generate_password_hash, check_password_hash
from .base_model import Base, BaseModel
# from models import to_dict
# from flask import jsonify


# Base = declarative_base()

class User(BaseModel, Base):
    __tablename__ = 'user'
    # id = Column(Integer, primary_key=True, nullable=False)
    username = Column(String(50), nullable=False)
    firstname = Column(String(50), nullable=False)
    lastname = Column(String(50), nullable=False)
    middlename = Column(String(50), nullable=True)
    email = Column(String(100), nullable=False, unique=True)  # Adjusted to ensure email is unique
    contact = Column(String(20), nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    image = Column(LargeBinary)  # Column for storing images
    is_active = Column(Boolean, default=True)

    __table_args__ = (UniqueConstraint('email', name='uix_1'),)  # Ensure email uniqueness at the database level

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)
