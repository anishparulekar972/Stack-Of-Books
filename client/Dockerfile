# Use the official Node.js image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /src

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app for production
RUN npm run build

# Expose the port that serve will run on
EXPOSE 3000

# Serve the build folder using serve
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
