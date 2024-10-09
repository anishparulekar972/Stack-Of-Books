# Use the official Node.js image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Expose the port the app will run on
EXPOSE 3000

# Start the app using serve
CMD ["npx", "serve", "-s", "build", "-l", "3000"]