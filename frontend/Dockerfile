# Redhat Certified Container Image
# https://catalog.redhat.com/software/containers/ubi8/nodejs-16/615aee9fc739c0a4123a87e1
FROM registry.access.redhat.com/ubi8/nodejs-16:1-68.1666660386 as node

WORKDIR /usr/app

# Disable npm progress bar
RUN npm set progress=false

# Copy everything, except whats listed in .dockerignore
COPY . .

EXPOSE 3000

#############################
#         Dev Build         #
#############################
FROM node as dev
ENV NODE_ENV=development

# Install dependencies.
RUN npm i

CMD ["npm", "start"]


#############################
#         Prod Build        #
#############################
FROM node as prod
ENV NODE_ENV=production

# Install dependencies. Only installs prod dependencies when NODE_ENV=production
RUN npm i

# Needed for serve to be available within the container
RUN npm install -g serve

RUN npm run build

WORKDIR /usr/app/dist

CMD ["serve", "-p", "3000"]
