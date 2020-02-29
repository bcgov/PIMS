FROM node:10-slim as node

# Install build toolchain, install node deps and compile native add-ons
RUN apt-get -yq update && apt-get -yq install make gcc g++ python --no-install-recommends

WORKDIR /usr/app

# install a specific NPM version
RUN npm install -g npm@6.9.0

COPY package*.json ./

RUN npm ci --quiet

COPY . .

# webpack-dev-server (3000)
EXPOSE 3000

CMD ["npm", "start"]
