from .user import User  # Import the User model

from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum, Table
from sqlalchemy.orm import relationship
from .base_model import Base, BaseModel
from sqlalchemy.dialects.postgresql import UUID

# Define the association table for the many-to-many relationship
task_user_link = Table('task_user_link', Base.metadata,
    Column('task_id', ForeignKey('task.id'), primary_key=True),
    Column('user_id', ForeignKey('user.id'), primary_key=True)
)

class Task(BaseModel,Base):
    __tablename__ = 'task'
    # id = Column(Integer, primary_key=True, nullable=False)
    user_id = Column(String,  ForeignKey('user.id'), nullable=False)  # Corrected table name to 'users'
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    # deadline = Column(DateTime, nullable=False)
    start_date = Column(String, nullable=False)
    end_date = Column(String, nullable=False)
    priority = Column(Enum("low", "medium", "high"), nullable=False)
    status = Column(Enum("todo", "in progress", "done"), nullable=False)
    # created_at = Column(DateTime, nullable=False)
    # updated_at = Column(DateTime, nullable=False)
    media = Column(String)  # Modified field for storing Base64 encoded documents as per TaskApi.tsx
    persons_responsible = relationship("User", secondary=task_user_link)  # Corrected to use the association table for the many-to-many relationship

    user = relationship("User", back_populates="tasks")

# Assuming there's a User model with a tasks relationship
User.tasks = relationship("Task", order_by=Task.id, back_populates="user")
# Assuming there's a secondary table for linking tasks and users responsible
