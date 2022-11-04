FROM node:16.10-bullseye as node

# install build toolchain
RUN apt-get update \
    && apt-get install --no-install-recommends -y dumb-init \
    && rm -rf /var/lib/apt/lists/*

# set entrypoint to `dumb-init` as it handles being pid 1 and forwarding signals
# so that you dont need to bake that logic into your node app
ENTRYPOINT ["dumb-init", "--"]

WORKDIR /usr/app

RUN npm set progress=false \
    && npm ci
    
COPY package*.json ./

RUN npm set progress=false \
    && npm ci
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
