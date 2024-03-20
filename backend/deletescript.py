from database import sessionmaker, engine
from datetime import datetime, timedelta
from models import Student_data,Namepronunciation, Userfeedback

def delete_incomplete_records():
    Session = sessionmaker(bind=engine)
    session = Session()

    # Calculate the cutoff time (2 or 3 minutes ago)
    cutoff_time = datetime.now() - timedelta(minutes=2)

    # Query for incomplete records older than cutoff_time
    incomplete_records_query = session.query(Student_data).outerjoin(Namepronunciation).outerjoin(Userfeedback).filter(
        (Namepronunciation.student_id == None) | (Userfeedback.student_id == None),
        Student_data.created_at <= cutoff_time
    )
    incomplete_records = incomplete_records_query.all()

    # Delete the incomplete records
    for record in incomplete_records:
        try:
            record_details = session.query(Student_data).filter(Student_data.student_id == record.student_id).first()
        except Exception as e:
            return {"status": "failed",
                    "message": f"error occured couldn't fetch details for student ID: {record.student_id}"}
        try:
            session.query(Namepronunciation).filter(Namepronunciation.student_id == record.student_id).delete(synchronize_session=False)
            session.commit()
        except Exception as e:
            pass
    
        try:
            session.query(Userfeedback).filter(Userfeedback.student_id == record.student_id).delete(synchronize_session=False)
            session.commit()
        except Exception as e:
            pass
    
        try:
            session.query(Student_data).filter(Student_data.student_id == record.student_id).delete(synchronize_session=False)
            session.commit()
        except Exception as e:
            return{"status": "failed",
               "message": f"Record with {record.student_id} doesn't exist in the system "}


    session.close()