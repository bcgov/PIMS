FROM registry.access.redhat.com/ubi8/nodejs-16:1-68.1666660386 as node

WORKDIR /usr/app

# Install npm version 8.5.5
RUN npm i -g npm@8.5.5

COPY package*.json ./

# Disable npm progress bar
RUN npm set progress=false

# Clean install dependencies
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
