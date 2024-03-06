# Technical Documentation: FastAPI Application

## Introduction

This technical documentation provides an overview of a FastAPI application designed to manage student records and phonetic pronunciations. The application facilitates various operations such as creating student records, updating records, retrieving records based on filters, managing user feedback, and more. It is built using Python and leverages the FastAPI framework for creating RESTful APIs.

## Installation

Follow these steps to install and set up the FastAPI application:

1. **Clone the Repository**: Clone the repository containing the FastAPI application code to your local machine.
   
2. **Install Dependencies**: Install the necessary dependencies by running `pip install -r requirements.txt` in the terminal.

3. **Database Configuration**: Configure the database connection details in the `database.py` file.

4. **Run the Application**: Start the FastAPI application by running `uvicorn main:app --reload` in the terminal.

## Overview

The FastAPI application consists of the following components:

1. **Main Script (`main.py`)**: The main script serves as the entry point for the FastAPI application. It initializes the FastAPI app, defines API endpoints, and starts the UVicorn server.

2. **Model Definitions**: The `models.py` file contains SQLAlchemy model definitions for the database tables used in the application.

3. **Database Connection (`database.py`)**: The `database.py` file establishes the database connection using SQLAlchemy and provides a function to obtain a database session.

4. **Request Models (`p_model_type.py`)**: The `p_model_type.py` file defines Pydantic models for request payloads used in various API endpoints.

5. **Utility Modules**: Additional utility modules such as `Split_word.py` and `different_languages.py` provide functionality for splitting words and handling different languages, respectively.

**Endpoints**

1. **Ping**

   - **Method:** GET
   - **Path:** /ping
   - **Description:** Endpoint to check the connection to the backend.

2. **Create Student Record**

   - **Method:** POST
   - **Path:** /createpost
   - **Description:** Endpoint to create a new student record in the database.

3. **Create Selection Record**

   - **Method:** POST
   - **Path:** /selection
   - **Description:** Endpoint to create a selection record for a student's phonetic preference.

4. **Get Student Records**

   - **Method:** GET
   - **Path:** /getRecords/
   - **Description:** Endpoint to retrieve student records based on various filters.

5. **Update Student Record**

   - **Method:** PUT
   - **Path:** /update
   - **Description:** Endpoint to update an existing student record.

6. **Submit User Feedback**

   - **Method:** POST
   - **Path:** /userfeedback
   - **Description:** Endpoint to submit user feedback.

7. **Delete Student Record**

   - **Method:** DELETE
   - **Path:** /deleterecord
   - **Description:** Endpoint to delete a student record from the database.

8. **Get Phonetic Audio**

   - **Method:** GET
   - **Path:** /getaudiophonetics
   - **Description:** Endpoint to retrieve audio files for phonetic names.

9. **Get Audio**

   - **Method:** GET
   - **Path:** /getaudio
   - **Description:** Endpoint to retrieve audio files for preferred names.

## Error Handling

The FastAPI application implements error handling to ensure robustness and reliability. It utilizes HTTP status codes and exception handling mechanisms to handle errors gracefully and provide informative error messages to clients.

## Security and Permissions

The application implements Cross-Origin Resource Sharing (CORS) to allow connections from specified origins. Access control mechanisms can be configured to restrict access to certain endpoints based on user roles and permissions.

## Conclusion

In conclusion, this technical documentation provides an overview of a FastAPI application designed for managing student records and phonetic pronunciations. By following the installation instructions and understanding the API endpoints, users can effectively utilize the application to perform various operations related to student management and feedback submission.

---
## Run the Project
1. Download Docker desktop.
2. Once installed, login to docker.
3. git clone https://github.com/VijayBonthu/final_project.git
4. Navigated to the path where it is cloned in command Prompt.
5. in the command prompt run **docker-compose up --build** from the root of the project.
6. The above command should download all the required dependencies and start frontend, backend and postgres DB.
7. If you have installed postgres before it might cause an issue with the ports, if you are facing issue with failed postgres server issue follow **step 10** to fix it. Once the below steps are done run **docker-compose up --build**
8. to stop the container **docker-compose down**.
9. to start the containers again **docker-compose up** if there are no changes to your program files. if you have changes then you have to run **docker-compose up --build**.
10. If you having issues accessing the database from other GUI's it is possible you have already an instance of postrges in your machine and it's not letting you access it.
      Press **Win + R** to open the Run dialog.
      Type **services.msc** and press Enter. This will open the Services window.
      Scroll down to find the PostgreSQL service. It may be named something like **"postgresql-x64-<version>"**.
      Right-click on the PostgreSQL service and select **"Stop"**.
   
## Change in file before running
1. To allow your front end to connect, you need to add the port of your frontend application to backend **main.py** in **CORS section**.
2. change your DB connection url ports and password in **docker-compose.yml** in **db** section and **Service** section
3. make sure the same **DB url** is used in **backend database.py**

