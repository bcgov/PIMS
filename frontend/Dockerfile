# Redhat Certified Container Image
# https://catalog.redhat.com/software/containers/ubi8/nodejs-18/6278e5c078709f5277f26998
FROM registry.access.redhat.com/ubi8/nodejs-18:1-32 as node

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
FROM node as prod-base
ENV NODE_ENV=production

# Install dependencies. Only installs prod dependencies when NODE_ENV=production
RUN npm i

# Build application
RUN npm run build

## Stage 2: Nginx state for serving content
FROM nginx:alpine-slim as prod

# copy custom nginx configuration from host to container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy static assets from builder stage
COPY --from=prod-base /usr/app/build .

# Provide nginx directory the required permissions
RUN chmod g+rwx /var/cache/nginx /var/run /var/log/nginx

# Run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
