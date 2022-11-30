# Redhat Certified Container Image
# https://catalog.redhat.com/software/containers/ubi8/nodejs-16/615aee9fc739c0a4123a87e1
FROM registry.access.redhat.com/ubi8/nodejs-16:1-68.1666660386 as node

WORKDIR /usr/app

COPY package.json ./

# Disable npm progress bar
RUN npm set progress=false

# Install dependencies
RUN npm i

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
