# Docker Hub offical image for node:18-bullseye-slim image
# https://hub.docker.com/layers/library/node/18.16-slim/images/sha256-8463e2d7bacf0cb576453a0ea8425f3b3c87fa9dd5c8a84ab1908cfd407f3edd?context=explore
FROM node:18.16-slim

WORKDIR /usr/app

COPY package.json ./

# Disable npm progress bar
RUN npm set progress=false

# Install dependencies
RUN npm i

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
