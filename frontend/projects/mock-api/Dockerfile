# Use a base image, such as Node.js
FROM node:18.17-alpine

# Set the working directory
WORKDIR /usr/src/mock-server

# Copy your mock server files into the Docker image
COPY . .

# Install any dependencies
RUN npm install

# Expose the port your mock server runs on
EXPOSE 3031

# Define the command to run your mock server
CMD ["npm", "run", "serve"]