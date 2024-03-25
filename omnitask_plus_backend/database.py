from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from models.base_model import Base

DATABASE_URI = 'sqlite:///omnitask_plus.db'

engine = create_engine(DATABASE_URI, echo=True)
session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))

Base.query = session.query_property()


def init_db():
    from models import user, task, study_session
    _ = user.User.__tablename__
    _ = task.Task.__tablename__
    _ = study_session.StudySession.__tablename__
    Base.metadata.create_all(bind=engine)
