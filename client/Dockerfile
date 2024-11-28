# Use the official Node.js image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR .

# Copy the package.json and package-lock.json files
COPY package.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Make sure serve is installed globally
RUN npm install -g serve

# Change the permissions for the start script
RUN chmod +x start.sh

# Build the React app for production
RUN npm run build

# Expose the port that serve will run on
EXPOSE 3000
EXPOSE 5000

# Serve the build folder using serve and express server
CMD ["/start.sh"]

# Start the dev server and express server using concurrently to use a proxy to bypass CORS
# CMD ["npx", "concurrently", "\"npm start\"", "\"node server.js\""]
