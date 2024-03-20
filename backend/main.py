
from fastapi import FastAPI, Depends, HTTPException, status
import uvicorn
import p_model_type
from different_languages import different_language
import models
from database import engine, SessionLocal
from sqlalchemy.orm import Session
from sqlalchemy import and_
from Split_word import Splitword
from sqlalchemy import exc
from fastapi.responses import StreamingResponse
import io
import os
from deletescript import delete_incomplete_records

from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware


#Database Creation
# This will create all the tables that are present in models.py automatically, in the future if you are adding anything new table add in models.py
load_dotenv()


# DATABASE_URL = f'postgresql://POSTGRES_USER:POSTGRES_PASSWORD@POSTGRES_HOSTNAME:POSTGRES_PORT/POSTGRES_DB'
models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()




app = FastAPI()

#Add whitelisting ip's below in origins. if an ip is added they will be able to connect to backend current frontend app running in port 4200
#CORS to connect to any ip Need to add ip's and ports here
origins = ["http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:4200",
    "http://app:4200",
    "http://192.168.2.72:4200",
    "http://10.28.5.119:4200",
    "http://10.28.13.45:4200",
    ]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


@app.get("/ping", status_code=status.HTTP_200_OK)
async def root():
    return {"You are connected to backend, there might be ip whitelisting that needs to be done in the backend, please reach out to admin team"}


#Create student Record
@app.post("/createpost", status_code=status.HTTP_201_CREATED )
async def tt_speech(details:p_model_type.Post, db: Session= Depends(get_db)):


    new_dict = details.dict()

    new_dict["preferred_name"].lower(),
    new_dict["first_name"] = details.first_name.lower()
    new_dict["last_name"] = details.last_name.lower()
    new_dict["course"] = details.course.upper()
    name = [details.first_name, details.last_name]
    full_name = " ".join(name)
    new_dict["full_name"] = full_name.lower()

    #creates Audio

    new_dict["audio_binary"] = "can be used in future to store the audio"


    #adding student details to DB
    new_student_details = models.Student_data(**new_dict)

    try:
        db.add(new_student_details)
        db.commit()
        db.refresh(new_student_details)
    except exc.IntegrityError as e:
        db.rollback()
        return {"status": "failed",
                "message":"Student ID already exists, please contact admin to have your record deleted"}

    #logic to get the phonetics from the DB
    phonetics_data = db.query(models.Phonetics).filter(models.Phonetics.names == new_student_details.preferred_name.lower()).all()
    split_first_name = Splitword().seperating_name(word=new_dict["preferred_name"])

    preferred_phonetics = [x.phonetics for x in phonetics_data]

    for pname in split_first_name:
        preferred_phonetics.append(pname)

    name_list = new_student_details.preferred_name.lower().split(",")
    #calling DB to get data
    results = db.query(models.Votes).filter(models.Votes.name.in_(name_list)).order_by(models.Votes.votes.desc()).limit(3).all()

    ordered_phonetics = []

    for x in results:
        ordered_phonetics.append(x.phonetic)
    ordered_phonetics.extend(preferred_phonetics)
    
    recommened_phonetics = []
    print(f"recommended_phonetics: {recommened_phonetics}")

    for x in ordered_phonetics:
        if x not in recommened_phonetics:
            recommened_phonetics.append(x)


    pro_data = {
    "student_id" : new_student_details.student_id,
    "first_name" : new_student_details.first_name.lower(),
    "last_name": new_student_details.last_name.lower(),
    "full_name": new_student_details.full_name.lower(),
    "preferred_name": new_student_details.preferred_name.lower(),
    "audio_binary": new_student_details.audio_binary,
    "pronoun": new_student_details.pronoun,
    "phonetics": recommened_phonetics
    }


    if len(results) == 0:
        pro_data["data_in_votes_table"] = False
    elif len(results)>0:
        pro_data["data_in_votes_table"] = True
    delete_incomplete_records()


    return {"data": pro_data,
            "results": [],
            "status":'success',
            "message":''}


#creating selection record
@app.post("/selection", status_code=status.HTTP_201_CREATED)
async def selection(details:p_model_type.Selection, db: Session= Depends(get_db)):

    input_details = {
    "student_id": details.student_id,
    "name": details.name[0].lower(),
    "phonetics_selection":details.phonetics_selection[0],
    "show":details.show,
    "data_in_votes_table": details.data_in_votes_table,
    "audio_selection": details.audio_selection
    }

#calling Db to get Data
    getting_votes = db.query(models.Votes).filter(and_(models.Votes.phonetic == input_details["phonetics_selection"], models.Votes.name == input_details["name"])).first()

#check if the record exist in db if not create a new record in votes table or else update the exisitng record by incrementing the vote
    if getting_votes == None:
            selection_data = {"student_id":input_details["student_id"],
                    "name":input_details["name"],
                    "phonetics_selection":input_details["phonetics_selection"],
                    "audio_selection":input_details["audio_selection"],
                    "show":input_details["show"]} 

            voting_data = {
                        "name":input_details["name"],
                        "phonetic":input_details["phonetics_selection"],
                        "votes":1}
            #add to db
            new_data = models.Namepronunciation(**selection_data)
            try:
                db.add(new_data)
                db.commit()
            except Exception as e:
                db.rollback()
                return {"status":"failed",
                        "message":f"couldn't process the request {e}"}
            #add to db
            new_data = models.Votes(**voting_data)
            try:
                db.add(new_data)
                db.commit()
            except Exception as e:
                print(f"couldn't add the record because {e}")
                db.rollback()
                return {"status":"failed",
                        "message":f"couldn't process the request {e}"}

    
    else:
        current_vote = {"id": getting_votes.votes_id,"name": getting_votes.name, "phonetic": getting_votes.phonetic, "votes":getting_votes.votes, "exist_in_phonetics_db": getting_votes.exist_in_phonetics_db}
        selection_data = {"student_id":input_details["student_id"],
                    "name":input_details["name"],
                    "phonetics_selection":input_details["phonetics_selection"],
                    "audio_selection":input_details["audio_selection"],
                    "show":input_details["show"]} 
        #add to db
        new_data = models.Namepronunciation(**selection_data)
        try:
            db.add(new_data)
            db.commit()
        except Exception as e:
            db.rollback()
            return {"status":"failed",
                    "message":f"couldn't process the request {e}."}
        
        voting_data = {"votes_id": current_vote["id"],
                    "name":input_details["name"],
                    "phonetic":input_details["phonetics_selection"],
                    "votes": current_vote["votes"] +1}
        #calling DB to get details
        post_query = db.query(models.Votes).filter(models.Votes.votes_id == voting_data["votes_id"])
        post = post_query.first()
        if post == None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"post with id: {voting_data['votes_id']} doesn't exist")
        try:
            post_query.update(voting_data, synchronize_session=False)
            db.commit()
        except Exception as e:
            db.rollback()
            return {"status":"failed",
                    "message":f"couldn't process the request {e}"}
    return {"status":'success',
            "message":''}


@app.get("/getRecord/", status_code=status.HTTP_200_OK)
async def get_students(studentID: str = None, db: Session= Depends(get_db)):

    delete_incomplete_records()
#calling DB to get details
    query =(
    db.query(models.Student_data.student_id, 
             models.Student_data.first_name,
             models.Student_data.last_name,
             models.Student_data.preferred_name,
             models.Namepronunciation.phonetics_selection,
             models.Student_data.pronoun,
             models.Student_data.course,
             models.Student_data.intake,
             models.Student_data.year,
             models.Namepronunciation.show)
             .join(
                 models.Namepronunciation,
                 models.Student_data.student_id == models.Namepronunciation.student_id
                 )
            )
 

    if studentID:
        results = query.filter(models.Student_data.student_id == studentID).all()


        if not results:
            return {
                "status": "failed",
            "message": f"StudentID: {studentID} doesn't exist"
            }
        else:
            final_response = []
            for record in results:
                student_id, first_name,last_name,preferred_name, phonetics_selection, pronoun, course, intake, year, show = record
                response_data = { "student_id": student_id,
                            "first_name": first_name,
                            "last_name": last_name,
                            "preferred_name": preferred_name,
                            "phonetics_selection": phonetics_selection,
                            "pronoun":pronoun,
                            "course":course,
                            "intake":intake,
                            "year":year,
                            "show":show
                            }
                final_response.append(response_data)


            return {"status": "success",
                "results": final_response}
    else:
        return {
            "status": "failed",
            "message": "StudentID is empty"
        }


@app.get("/getRecords/", status_code=status.HTTP_200_OK)
async def get_students(studentID: str = None,
    firstname: str = None,
    lastname: str = None,
    preferred_name: str = None,
    year: str = None,
    course: str = None,
    intake: str = None, 
    offset: int = 0,
    limit: int = 10,
    db: Session= Depends(get_db)):

#calling DB to get details
    query =(
    db.query(models.Student_data.student_id, 
             models.Student_data.first_name,
             models.Student_data.last_name,
             models.Student_data.preferred_name,
             models.Namepronunciation.phonetics_selection,
             models.Student_data.pronoun,
             models.Student_data.course,
             models.Student_data.intake,
             models.Student_data.year,
             models.Namepronunciation.show)
             .join(
                 models.Namepronunciation,
                 models.Student_data.student_id == models.Namepronunciation.student_id
                 )
            )

    if studentID:
        query = query.filter(models.Student_data.student_id == studentID)

    if firstname:
        query = query.filter(models.Student_data.first_name.ilike(f'%{firstname}%'))
    if lastname:
        query = query.filter(models.Student_data.last_name.ilike(f'%{lastname}%'))
    if preferred_name:
        query = query.filter(models.Student_data.preferred_name.ilike(f'%{preferred_name}%'))
    if year:
        query = query.filter(models.Student_data.year == year)
    if course:
        query = query.filter(models.Student_data.course == course)
    if intake:
        query = query.filter(models.Student_data.intake == intake)

    total_count = query.count()

    query = query.offset(offset).limit(limit)
    results = query.all()

    final_response = []
    for record in results:
        student_id, first_name,last_name,preferred_name, phonetics_selection, pronoun, course, intake, year, show = record
        response_data = { "student_id": student_id,
                    "first_name": first_name,
                    "last_name": last_name,
                    "preferred_name": preferred_name,
                    "phonetics_selection": phonetics_selection,
                    "pronoun":pronoun,
                    "course":course,
                    "intake":intake,
                    "year":year,
                    "show":show
                    }
        final_response.append(response_data)

    return {"total_count": total_count,
        "results": final_response}


@app.put("/update", status_code=status.HTTP_200_OK)
async def selection(details:p_model_type.Update, db: Session= Depends(get_db)):

    full_name = details.first_name.lower()+" "+ details.last_name.lower()
    student_data = {
        "student_id":details.student_id,
        "first_name":details.first_name.lower(),
        "last_name":details.last_name.lower(),
        "full_name":full_name,
        "pronoun":details.pronoun,
        "preferred_name":details.preferred_name.lower(),
        "course":details.course.upper(),
        "intake":details.intake,
        "year":details.year
    }

    pronounciation_data = {
        "student_id":details.student_id,
        "name":details.preferred_name.lower(),
        "phonetics_selection":details.phonetics_selection,
        "audio_selection":"this record is edited so no audio is created",
        "show":True

    }

    getting_votes = db.query(models.Votes).filter(and_(models.Votes.phonetic == details.phonetics_selection, models.Votes.name == details.preferred_name)).first()
    if getting_votes == None:
        voting_data = {
                        "name":details.preferred_name.lower(),
                        "phonetic": details.phonetics_selection,
                        "votes":1}
        #add to db
        new_data = models.Votes(**voting_data)
        try:
                db.add(new_data)
                db.commit()
        except Exception as e:
                print(f"couldn't add the record to voting table because {e}")
                db.rollback()
                return {"status": "failed",
                    "message": f"something went wrong when executing probable error {e}"}
    else:
        voting_data = {
                        "votes_id": getting_votes.votes_id,
                        "name":details.preferred_name,
                        "phonetic": details.phonetics_selection,
                        "votes":getting_votes.votes+1}
        #calling db to get details
        try:
            db.query(models.Votes).filter(models.Votes.votes_id == getting_votes.votes_id).update(voting_data, synchronize_session=False)
            db.commit()
        except Exception as e:
            db.rollback()
            return {"status": "failed",
                    "message": f"something went wrong when executing probable error {e}"}

    
#calling DB to get details
    try:
        db.query(models.Student_data).filter(models.Student_data.student_id == details.student_id).update(student_data, synchronize_session=False)
        db.commit()
        db.query(models.Namepronunciation).filter(models.Namepronunciation.student_id == details.student_id).update(pronounciation_data, synchronize_session=False)
        db.commit()
        db.query(models.Votes).filter(models.Votes.phonetic == pronounciation_data["phonetics_selection"])
    except Exception as e:
        print(e)
        db.rollback()
        return {"message": e,
                "status": "failed"}
    return {"status": "success",
            "message": "updated record successfully"}
    
    
@app.post("/userfeedback", status_code=status.HTTP_201_CREATED)
async def user_feedback(details:p_model_type.userfeedback, db: Session= Depends(get_db)):
    data = {
        "student_id":details.student_id,
        "userfeedback":details.userfeedback
    }

    #add to db
    try:
        new_data = models.Userfeedback(**data)
        db.add(new_data)
        db.commit()
    except Exception as e:
        db.rollback()
        return {"status": "failed",
                "message": "incorrect details received or feedback for this user is already exist."}
    return {"status": "success",
            "message": ""}

@app.delete("/deleterecord", status_code=status.HTTP_200_OK)
async def delete_record(student_id: str, db: Session= Depends(get_db)):
 #calling db to get details
    try:
        record_details = db.query(models.Student_data).filter(models.Student_data.student_id == student_id).first()
    except Exception as e:
        return {"status": "failed",
                "message": f"error occured couldn't fetch details for student ID: {student_id}"}
    if record_details != None:
        try:
            db.query(models.Namepronunciation).filter(models.Namepronunciation.student_id == student_id).delete(synchronize_session=False)
            db.commit()
        except Exception as e:
            pass
    
        try:
            db.query(models.Userfeedback).filter(models.Userfeedback.student_id == student_id).delete(synchronize_session=False)
            db.commit()
        except Exception as e:
            pass
    
        try:
            db.query(models.Student_data).filter(models.Student_data.student_id == student_id).delete(synchronize_session=False)
            db.commit()
        except Exception as e:
            return{"status": "failed",
               "message": f"Record with {student_id} doesn't exist in the system "}
    return {"status": "success",
            "message": "Deleted record successfully"}

@app.get("/getaudiophonetics", status_code=status.HTTP_200_OK)
async def get_audio(phonetics_name:str, db: Session=Depends(get_db)):
    try:
        different_language(text=phonetics_name, lang="en")
    except Exception as e:
        return{"status": "failed",
               "message": "Audio services are currently unavailable, please try again later"}
    file_path = f'{phonetics_name}.wav'
    try:
        with open(file_path, "rb") as file:  # Open in binary mode 'rb'
            audio_binary_data = file.read()  # Read binary data

        # Remove temporary WAV file
        if os.path.exists(file_path):
            os.remove(file_path)

        return StreamingResponse(io.BytesIO(audio_binary_data), media_type="audio/wav")

    except Exception as e:
        return {
            "status": "failed",
            "message": f"unable to get audio at this moment: {e}"
        }


@app.get("/getaudio", status_code=status.HTTP_200_OK)
async def get_audio(preferred_name:str, db: Session=Depends(get_db)):
    try:
        different_language(text=preferred_name, lang="en")
    except Exception as e:
        return{"status": "failed",
               "message": "Audio services are currently unavailable, please try again later"}
    file_path = f'{preferred_name}.wav'
    try:
        with open(file_path, "rb") as file:  
            audio_binary_data = file.read()  
           

        # Remove temporary WAV file
        if os.path.exists(file_path):
            os.remove(file_path)

        return StreamingResponse(io.BytesIO(audio_binary_data), media_type="audio/wav")


    except Exception as e:
        return {
            "status": "failed",
            "message": f"unable to get audio at this moment: {e}"
        }

# if __name__ == "__main__":
#     uvicorn.run("main:app", port=8081, log_level="info", reload=True)
