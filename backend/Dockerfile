# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PYTHONPATH "${PYTHONPATH}:/app/backend"

# Set the working directory in the container
WORKDIR /app/backend

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . /app/backend/

# Expose the port FastAPI runs on
EXPOSE 8081

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8081"]

# # Use an official Python runtime as a parent image
# FROM python:3.9-slim

# # Set environment variables
# ENV PYTHONDONTWRITEBYTECODE 1
# ENV PYTHONUNBUFFERED 1
# ENV PYTHONPATH "${PYTHONPATH}:/app/backend"

# # Set the working directory in the container
# WORKDIR /app

# # Copy and install dependencies
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# # Copy the backend directory into the container
# COPY backend /app/backend

# # Expose the port FastAPI runs on
# EXPOSE 8081

# # Command to run the application
# CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8081"]
