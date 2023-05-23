# Docker Hub offical image for node:18-bullseye-slim image
# https://hub.docker.com/layers/library/node/18-bullseye-slim/images/sha256-48a99b923315db4ddc4800557af85dd2f6fefd7659877d586548fd4fd9768dec?context=explore
FROM node:18.16-bullseye

WORKDIR /usr/app

COPY package.json ./

# Disable npm progress bar
RUN npm set progress=false

# Install dependencies
RUN npm i

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
