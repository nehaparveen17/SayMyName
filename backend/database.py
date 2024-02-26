from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, declarative_base
import pandas as pd
import os

# SQLALCHEMY_DATABASE_URL = 'postgresql://postgres:123456@localhost/postgres'
# # SQLALCHEMY_DATABASE_URL = 'postgresql://postgres:123456@db/postgres'

POSTGRES_USER = os.environ.get("POSTGRES_USER")
POSTGRES_PASSWORD = os.environ.get("POSTGRES_PASSWORD")
POSTGRES_DB = os.environ.get("POSTGRES_DB")
POSTGRES_PORT = os.environ.get("POSTGRES_PORT")
POSTGRES_HOSTNAME = os.environ.get("POSTGRES_HOSTNAME")

DATABASE_URL = f'postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOSTNAME}:{POSTGRES_PORT}/{POSTGRES_DB}'

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

df = pd.read_csv("final_phonetics_datav1.csv")

try:
    df.to_sql('phonetics_table', engine)
except ValueError as e:
    print(f"{e} so skipping the table creation, if the data is not loaded, check the DB and deleted the phonetic_table")
    pass