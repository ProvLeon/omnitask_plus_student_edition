from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .base_model import Base, BaseModel
import datetime

class Chat(BaseModel, Base):
    __tablename__ = 'chats'
    sender_id = Column(String, ForeignKey('user.id'), nullable=False)
    receiver_id = Column(String, ForeignKey('user.id'), nullable=False)
    text = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    sender = relationship("User", foreign_keys=[sender_id])
    receiver = relationship("User", foreign_keys=[receiver_id])

