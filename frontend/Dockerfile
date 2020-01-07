FROM node:10-slim as node

# # Arguments to init environment variables.
# ARG env=development
# ARG kcUrl=http://host.docker.internal:8080/auth/admin/realms/quartech/users
# ARG usePolling=true

# # Copy arguments into environment variables.
# ENV NODE_ENV=${env}
# ENV KEYCLOAK_URL=${kcUrl}
# ENV CHOKIDAR_USEPOLLING=${usePolling}

WORKDIR /usr/app

# install a specific NPM version
RUN npm install -g npm@6.9.0

COPY package*.json ./

RUN npm ci

COPY . .

# webpack-dev-server (3000)
EXPOSE 3000

CMD ["npm", "start"]
