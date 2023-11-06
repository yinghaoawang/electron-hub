# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory within the container
WORKDIR /server

# Copy the server application files into the container
COPY . .

# Install server dependencies
RUN npm install
# RUN npm run build

# Expose the port that your Fastify server will listen on
EXPOSE 8080
ENV ADDRESS=0.0.0.0 PORT=8080

# Define the command to start your Fastify server
CMD ["npm", "run", "dev", "--", "--colors"]