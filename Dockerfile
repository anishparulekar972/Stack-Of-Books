# Start from an official Node.js image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code into the working directory
COPY . .

# Expose port 5000 to allow access to the web server
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"]
