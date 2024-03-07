from database import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, LargeBinary, BINARY
from sqlalchemy.sql.sqltypes import TIMESTAMP
from sqlalchemy.sql.expression import text

class Student_data(Base):
    __tablename__ = "student_data"

    id = Column(Integer, primary_key=True, nullable=False)
    student_id = Column(Integer, unique=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    preferred_name = Column(String, nullable=False)
    pronoun = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    status_active = Column(Boolean, server_default='TRUE', nullable=False)
    course = Column(String, nullable=False)
    intake = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    audio_binary = Column(String)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default= text('now()'))

class Namepronounciation(Base):
    __tablename__ = "pronounciation"

    id = Column(Integer, primary_key=True, nullable=False)
    student_id = Column(Integer, ForeignKey(Student_data.student_id), nullable=False)
    name = Column(String, nullable=False)
    phonetics_selection = Column(String, nullable=False)
    audio_selection = Column(String)
    # votes = Column(Integer, nullable=False, server_default= text('0'))
    show = Column(Boolean, server_default='False') 
     
class Phonetics(Base):
    __tablename__ = 'phonetics_table'

    phonetics_id = Column(Integer, primary_key=True)
    names = Column(String, nullable=False)
    phonetics = Column(String, nullable=False)

class Votes(Base):
    __tablename__ = 'votes'

    votes_id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    phonetic = Column(String, nullable=False)
    votes = Column(Integer, nullable=False, server_default= text('1'))
    exist_in_phonetics_db = Column(Boolean, server_default='False') 

class Userfeedback(Base):
    __tablename__ = 'userfeedback'
    id = Column(Integer, primary_key=True, nullable=False)
    student_id = Column(Integer, ForeignKey(Student_data.student_id), nullable=False, unique=True)
    userfeedback = Column(String, nullable=False)