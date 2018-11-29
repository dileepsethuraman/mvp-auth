# Import necessary node docker image

FROM node:8.12.0-alpine

# Set environment variables
ENV STATE="PRE-PROD"

# Set WORKDIR
WORKDIR /mvp-auth

# Copy all the files into the container
COPY . .

# Install required node modules
RUN npm install

# Document ports to be exposed
EXPOSE 3000

# Define entry point for running npm scripts
# ENTRYPOINT npm

