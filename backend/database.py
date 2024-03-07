from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import pandas as pd

# SQLALCHEMY_DATABASE_URL = 'postgresql://postgres:123456@localhost/postgres'
SQLALCHEMY_DATABASE_URL = 'postgresql://postgres:SayMyName@db/postgres'

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

df = pd.read_csv("final_phonetics_datav1.csv")

try:
    df.to_sql('phonetics_table', engine)
except ValueError as e:
    print(f"{e} so skipping the table creation, if the data is not loaded, check the DB and deleted the phonetic_table")
    pass