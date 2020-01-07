# >docker build -t keycloak .
# >docker run --env-file=../../.env -d keycloak
# https://hub.docker.com/r/jboss/keycloak/
FROM jboss/keycloak:7.0.0

# # Arguments to init environment variables.
# ARG vendor=POSTGRES
# ARG host=keycloak-db
# ARG db=keycloak
# ARG user=keycloak
# ARG password=password

# ARG import=/tmp/realm-export.json
# ARG kcLogLevel=WARN
# ARG logLevel=WARN

# # Copy arguments into environment variables.
# ENV DB_VENDOR=${vendor}
# ENV DB_ADDR=${host}
# ENV DB_DATABASE=${db}
# ENV DB_USER=${user}
# ENV DB_PASSWORD=${password}

# ENV KEYCLOAK_USER=${user}
# ENV KEYCLOAK_PASSWORD=${password}
# ENV KEYCLOAK_IMPORT=${import}
# ENV KEYCLOAK_LOGLEVEL=${kcLogLevel}
# ENV ROOT_LOGLEVEL=${logLevel}

EXPOSE 8080

ADD ./config /tmp
