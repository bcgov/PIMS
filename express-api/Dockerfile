#############################################
#                 Base                #
#############################################
# Use an official Node.js runtime as a base image
FROM node:18.17.1-bullseye-slim as base

# Set the working directory in the container
WORKDIR /express-api

ENV NODE_ENV=development
ENV CONTAINERIZED=true

# Copy files, excluding those in .dockerignore
COPY . .

# Install packages. Needed for build process.
RUN npm i

# Generate swagger-output
RUN npm run swagger

# Compile to JavaScript build 
RUN npm run build

#############################################
#                 Prod Build                #
#############################################
FROM node:18.17.1-bullseye-slim as Prod

# Set the working directory to /express-api
WORKDIR /express-api

ENV NODE_ENV=production
ENV CONTAINERIZED=true

# Install packages. Needed even for compiled build.
# Only installs non-dev dependencies
COPY package.json .
RUN npm i

# Add curl for health check
RUN apt-get update
RUN apt-get install -y curl

# Copy compiled build from base
COPY --from=base /express-api/dist .

CMD [ "node", "src/server.js" ]

