from .user import User
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from .base_model import Base, BaseModel
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID

class StudySession(BaseModel, Base):
    __tablename__ = 'study_sessions'
    # id = Column(Integer, primary_key=True, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey('user.id'), nullable=False)
    session_name = Column(String(100), nullable=False)
    session_description = Column(Text, nullable=False)
    start_time = Column(DateTime, nullable=False, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=False)  # Updated to not nullable as per the new schema
    participants = Column(Text, nullable=False)
    notes = Column(Text, nullable=True)  # Added field for notes
    # created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    # updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="study_sessions")

# Assuming there's a User model with a study_sessions relationship
User.study_sessions = relationship("StudySession", order_by=StudySession.id, back_populates="user")

