from pydantic import BaseModel
from typing import Literal, Optional


class Post(BaseModel):
    first_name: str
    pronoun: str
    last_name:str
    preferred_name: str
    student_id : int
    course: str
    intake: Literal["Fall", "January", "May"]
    year: int


class Selection(BaseModel): 
    student_id : int
    name:list
    phonetics_selection: list
    audio_selection: str
    show: bool
    data_in_votes_table: bool

# class Selection(BaseModel): 
#     vote_id : int
#     name:list
#     phonetics_selected: list
#     audio_selected: str
    
class Update(BaseModel):
    student_id: int
    first_name: str
    pronoun: str
    last_name:str
    preferred_name: str
    course: str
    intake: Literal["Fall", "January", "May"]
    year: int
    phonetics_selection: str
    

class userfeedback(BaseModel):
    student_id: int
    userfeedback: str

class deleterecord(BaseModel):
    student_id:int

class getaudio(BaseModel):
    preferred_name:str

class getaudiophonetics(BaseModel):
    phonetics_name:str