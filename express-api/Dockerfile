#############################################
#                 Base                #
#############################################
# Use an official Node.js runtime as a base image
FROM node:21.6-bullseye-slim as base

# Set the working directory in the container
WORKDIR /express-api

ENV NODE_ENV=development
ENV CONTAINERIZED=true

# Copy files, excluding those in .dockerignore
COPY . .

# Install packages. Needed for build process.
RUN npm i

# Compile to JavaScript build 
RUN npm run build

#############################################
#                 Prod Build                #
#############################################
FROM node:21.6-bullseye-slim as Prod

# Set the working directory to /express-api
WORKDIR /express-api

ENV NODE_ENV=production
ENV CONTAINERIZED=true

# Install packages. Needed even for compiled build.
# Only installs non-dev dependencies
COPY package.json .
RUN npm i

# Add curl for health check
RUN apt-get update && apt-get install -y curl

# Copy compiled build from base
COPY --from=base /express-api/dist .
# Copy seed SQL files. Typescript compiler ignores these.
COPY --from=base /express-api/src/typeorm/Migrations/Seeds ./src/typeorm/Migrations/Seeds

RUN chmod g+rwx /express-api

CMD [ "node", "src/server.js" ]

