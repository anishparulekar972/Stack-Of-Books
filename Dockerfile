# syntax=docker/dockerfile:1
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install
RUN npm install express

# Install Redis client for Node.js
RUN npm install redis

# Copy the rest of the application
COPY . .

# Expose the port
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"]

