# https://hub.docker.com/layers/library/node/18.16-bullseye-slim/images/
# sha256-8463e2d7bacf0cb576453a0ea8425f3b3c87fa9dd5c8a84ab1908cfd407f3edd?context=explore
FROM node:18.16-bullseye-slim

WORKDIR /app
ENV NODE_ENV=development

# Copy files, excluding those in .dockerignore
COPY . .

# Install dependencies and disable npm progress bar
RUN npm set progress=false
RUN npm i

EXPOSE 3000

CMD ["npm", "start"]
