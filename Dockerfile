# Use the official Node.js image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /client

# Copy only the client folder
COPY client/package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY client ./

# Build the React app for production
# RUN npm run build

# Expose the port that serve will run on
EXPOSE 3000
EXPOSE 5000

# Serve the build folder using serve and express server
CMD ["npx", "concurrently", "\"npm start\"", "\"node server.js\""]