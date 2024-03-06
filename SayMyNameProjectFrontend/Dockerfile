# Use the latest Node.js LTS image as the base image
FROM node:20 as build

# Set the working directory in the container
WORKDIR /app/frontend

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Install @angular-devkit/build-angular package
RUN npm install -g @angular/cli

# Copy the entire project to the container
COPY . .

# Expose port 4200 (assuming your Angular app runs on this port)
EXPOSE 4200

# Command to start the Angular development server
CMD ng serve --host 0.0.0.0

