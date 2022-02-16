FROM node:16.10-bullseye

WORKDIR /usr/app
COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
