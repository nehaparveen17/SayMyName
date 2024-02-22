
from fastapi import FastAPI, Depends, HTTPException, status, Response
import uvicorn
import p_model_type
from different_languages import different_language
import models
import models
from database import engine, SessionLocal
from sqlalchemy.orm import Session
from sqlalchemy import and_
import os
from sqlalchemy import exc
from fastapi.responses import StreamingResponse
import io


from fastapi.middleware.cors import CORSMiddleware


#Database Creation
models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


app = FastAPI()

#CORS to connect to any ip Need to add ip's and ports here
origins = ["http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:4200"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root(request):
    return {"Hello": "World"}


#Create student Record
@app.post("/createpost", status_code=status.HTTP_201_CREATED )
def tt_speech(details:p_model_type.Post, response:Response, db: Session= Depends(get_db)):


    new_dict = details.dict()

    new_dict["preferred_name"].lower(),
    new_dict["first_name"] = details.first_name.lower()
    new_dict["last_name"] = details.last_name.lower()
    new_dict["course"] = details.course.upper()
    name = [details.first_name, details.last_name]
    full_name = " ".join(name)
    new_dict["full_name"] = full_name.lower()
    file_name = full_name+str(details.student_id)
    preferred_name = new_dict["preferred_name"]

    #creates Audio
    different_language(text=preferred_name,lang="en")
    with open(f"{preferred_name}.wav", "rb") as file: 
        audio_binary = file.read()
        # print(type(audio_binary))
    new_dict["audio_binary"] = audio_binary
    if os.path.exists(f"{preferred_name}.wav"):
        os.remove(f"{preferred_name}.wav")
    with open(f"{file_name}.wav", "wb") as file:
        file.write(audio_binary)

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
        # if "duplicate key value violates unique constraint" in str(e):
        #     raise HTTPException(status_code=404, detail="Student ID already exists")   
        db.rollback()
        return {"status": "failed",
                "message":"Student ID already exists"}

    #logic to get the phonetics from the DB
    phonetics_data = db.query(models.Phonetics).filter(models.Phonetics.names == new_student_details.preferred_name.lower()).all()


    preferred_phonetics = [x.phonetics for x in phonetics_data]

    pro_data = {
    "student_id" : new_student_details.student_id,
    "first_name" : new_student_details.first_name.lower(),
    "last_name": new_student_details.last_name.lower(),
    "full_name": new_student_details.full_name.lower(),
    "preferred_name": new_student_details.preferred_name.lower(),
    "audio_binary": new_student_details.audio_binary,
    "pronoun": new_student_details.pronoun,
    "phonetics": preferred_phonetics
    }


    name_list = pro_data["preferred_name"].split(",")


    results = db.query(models.Votes).filter(models.Votes.name.in_(name_list)).order_by(models.Votes.votes.desc()).limit(3).all()

    print(len(results))
    if len(results) == 0:
        pro_data["data_in_votes_table"] = False
    elif len(results)>0:
        pro_data["data_in_votes_table"] = True


    return {"data": pro_data,
            "results": results,
            "status":'success',
            "message":''}


#creating selection record
@app.post("/selection", status_code=status.HTTP_201_CREATED)
def selection(details:p_model_type.Selection, db: Session= Depends(get_db)):


#Checking to see if the created record is new, if details.data_in_votes_table is true then data exists so votes in vote table will be updated 
    if details.data_in_votes_table is True:
        print("details exists")
        getting_votes = db.query(models.Votes).filter(models.Votes.phonetic.in_(details.phonetics_selection)).all()
        print(getting_votes)

        current_vote = [{"id": x.votes_id,"name": x.name, "phonetic": x.phonetic, "votes":x.votes, "exist_in_phonetics_db": x.exist_in_phonetics_db} for x in getting_votes]
        print(current_vote)
        try:
            print(current_vote[0]["id"])
        except IndexError as e:
            return {"status":'failed',
                    "message":"Data is not present in votes table please check data_in_votes_table files in set to false"}
        statement_dict = []
        voting_data_dict = []
        for i in range(len(details.name)):
            data = {"student_id":details.student_id,
                    "name":details.name[i],
                    "phonetics_selection":details.phonetics_selection[i],
                    "audio_selection":details.audio_selection[i],
                    "show":details.show}
            statement_dict.append(data)  
        for stat_dict in statement_dict:
            new_data = models.Namepronounciation(**stat_dict)
            db.add(new_data)
            db.commit()
        for i in range(len(current_vote)):
            voting_data = {"votes_id": current_vote[i]["id"],
                        "name":details.name[i],
                        "phonetic": details.phonetics_selection[i],
                        "votes": current_vote[i]["votes"] +1}
            voting_data_dict.append(voting_data)

        print(voting_data_dict)
        for vote_dict in voting_data_dict:
            print(vote_dict)
            post_query = db.query(models.Votes).filter(models.Votes.votes_id == vote_dict["votes_id"])
            print(post_query)
            post = post_query.first()
            print(post)
            if post == None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"post with id: {vote_dict['votes_id']} doesn't exist")
            try:
                post_query.update(vote_dict, synchronize_session=False)
                db.commit()
            except Exception as e:
                print(e) 
                db.rollback()
            
# data not present in votes table a new record will be created with vote as 1
    if details.data_in_votes_table is False:
        statement_dict = []
        voting_data_dict = []
        for i in range(len(details.name)):
            data = {"student_id":details.student_id,
                    "name":details.name[i],
                    "phonetics_selection":details.phonetics_selection[i],
                    "audio_selection":details.audio_selection,
                    "show":details.show}
            statement_dict.append(data) 

            voting_data = {
                        "name":details.name[i],
                        "phonetic": details.phonetics_selection[i],
                        "votes":1}
            voting_data_dict.append(voting_data)
             
        for stat_dict in statement_dict:
            new_data = models.Namepronounciation(**stat_dict)
            db.add(new_data)
            db.commit()

        # for i in range(len(details.name)):
        #     voting_data = {
        #                 "name":details.name[i],
        #                 "phonetic": details.phonetics_selection[i],
        #                 "votes":1}
        #     voting_data_dict.append(voting_data)
        for vote_dict in voting_data_dict:
            new_data = models.Votes(**vote_dict)
            try:
                db.add(new_data)
                db.commit()
            except Exception as e:
                print(f"couldn't add the record because {e}")
                db.rollback()

    return {"status":'success',
            "message":''}

@app.get("/getRecords/")
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

    query =(
    db.query(models.Student_data.student_id, 
             models.Student_data.first_name,
             models.Student_data.last_name,
             models.Student_data.preferred_name,
             models.Namepronounciation.phonetics_selection,
             models.Student_data.pronoun,
             models.Student_data.course,
             models.Student_data.intake,
             models.Student_data.year,
             models.Namepronounciation.show)
             .join(
                 models.Namepronounciation,
                 models.Student_data.student_id == models.Namepronounciation.student_id
                 )
            )


    print(query)

    if studentID:
        query = query.filter(models.Student_data.student_id == studentID)
        print(query)
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


@app.put("/update", status_code=status.HTTP_201_CREATED)
async def selection(details:p_model_type.Update, db: Session= Depends(get_db)):

    full_name = details.first_name.lower()+" "+ details.last_name.lower()
    student_data = {
        "student_id":details.student_id,
        "first_name":details.first_name.lower(),
        "last_name":details.last_name.lower(),
        "full_name":full_name,
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
        try:
            db.query(models.Votes).filter(models.Votes.votes_id == getting_votes.votes_id).update(voting_data, synchronize_session=False)
            db.commit()
        except Exception as e:
            db.rollback()
            return {"status": "failed",
                    "message": f"something went wrong when executing probable error {e}"}

    

    try:
        db.query(models.Student_data).filter(models.Student_data.student_id == details.student_id).update(student_data, synchronize_session=False)
        db.commit()
        db.query(models.Namepronounciation).filter(models.Namepronounciation.student_id == details.student_id).update(pronounciation_data, synchronize_session=False)
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
def user_feedback(details:p_model_type.userfeedback, db: Session= Depends(get_db)):
    data = {
        "student_id":details.student_id,
        "userfeedback":details.userfeedback
    }
    print(data)
    try:
        new_data = models.Userfeedback(**data)
        print(new_data)
        db.add(new_data)
        db.commit()
    except Exception as e:
        print(e)
        db.rollback()
        return {"status": "failed",
                "message": "incorrect details received or feedback for this user is already exist."}
    return {"status": "success",
            "message": ""}

@app.delete("/deleterecord", status_code=status.HTTP_201_CREATED)
def delete_record(details:p_model_type.deleterecord, db: Session= Depends(get_db)):
    data = {
        "student_id": details.student_id
    }
    record_details = db.query(models.Student_data).filter(models.Student_data.student_id == details.student_id).first()
    if record_details != None:
        try:
            db.query(models.Namepronounciation).filter(models.Namepronounciation.student_id == details.student_id).delete(synchronize_session=False)
            db.commit()
            db.query(models.Userfeedback).filter(models.Userfeedback.student_id == details.student_id).delete(synchronize_session=False)
            db.commit()
            db.query(models.Student_data).filter(models.Student_data.student_id == details.student_id).delete(synchronize_session=False)
            db.commit()
        except Exception as e:
            db.rollback()
            return {"status": "failed",
                    "message": e}
    else:
        return{"status": "success",
               "message": f"Record with {details.student_id} doesn't exist in the system "}
    return {"status": "success",
            "message": "Deleted record successfully"}

@app.get("/getaudiophonetics", status_code=status.HTTP_200_OK)
def get_audio(details:p_model_type.getaudiophonetics, db: Session=Depends(get_db)):
    data = {
        "phonetics_name" :details.phonetics_name.lower()
    }

    print(data["phonetics_name"])
    different_language(text=data["phonetics_name"], lang="en")
    file_path = f'{data["phonetics_name"]}.wav'
    try:
        with open(file_path, "rb") as file:  # Open in binary mode 'rb'
            audio_binary_data = file.read()  # Read binary data
            # new_dict_audio = {"audio_binary_data": audio_binary_data}  # Store in dictionary

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
def get_audio(details:p_model_type.getaudio, db: Session=Depends(get_db)):
    data = {
        "preferred_name" :details.preferred_name
    }

    different_language(text=data["preferred_name"], lang="en")
    file_path = f'{data["preferred_name"]}.wav'
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
