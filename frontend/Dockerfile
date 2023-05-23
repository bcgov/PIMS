# https://catalog.redhat.com/software/containers/ubi8/nodejs-18/6278e5c078709f5277f26998
FROM registry.access.redhat.com/ubi8/nodejs-18:1-32 as node

WORKDIR /usr/app

COPY package.json ./

# Disable npm progress bar
RUN npm set progress=false

# Install dependencies
RUN npm i

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
