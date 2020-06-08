# >docker build -t keycloak .
# >docker run --env-file=../../.env -d keycloak
# https://hub.docker.com/r/jboss/keycloak/
FROM jboss/keycloak:10.0.2

EXPOSE 8080

COPY ./config/*.json /tmp/
