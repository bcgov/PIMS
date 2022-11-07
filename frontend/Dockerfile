FROM registry.access.redhat.com/ubi8/nodejs-16:1-68.1666660386 as node

WORKDIR /usr/app

# Install npm version 8.19.3
RUN npm i -g npm@8.19.3

COPY package*.json ./

# Disable npm progress bar
RUN npm set progress=false

# Clean install dependencies
RUN npm ci --legacy-peer-deps

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
