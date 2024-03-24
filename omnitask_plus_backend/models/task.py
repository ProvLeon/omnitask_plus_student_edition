from .user import User  # Import the User model

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum, LargeBinary
from sqlalchemy.orm import relationship
from .basemodel import Base

class Task(Base):
    __tablename__ = 'tasks'
    # id = Column(Integer, primary_key=True, nullable=False)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    deadline = Column(DateTime, nullable=False)
    priority = Column(Enum("low", "medium", "high"), nullable=False)
    status = Column(Enum("pending", "in progress", "completed"), nullable=False)
    # created_at = Column(DateTime, nullable=False)
    # updated_at = Column(DateTime, nullable=False)
    media = Column(LargeBinary)  # Added field for storing documents

    user = relationship("User", back_populates="tasks")

# Assuming there's a User model with a tasks relationship
User.tasks = relationship("Task", order_by=Task.id, back_populates="user")
