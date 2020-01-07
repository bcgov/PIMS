# >docker build -t keycloak-db .
# >docker run --env-file=../../.env -d keycloak-db
# https://hub.docker.com/r/centos/postgresql-10-centos7
FROM registry.access.redhat.com/rhscl/postgresql-10-rhel7:latest

# # Arguments to init environment variables.
# ARG db=keycloak
# ARG user=keycloak
# ARG password=password

# # Copy arguments into environment variables.
# ENV POSTGRESQL_DATABASE=${db}
# ENV POSTGRESQL_USER=${user}
# ENV POSTGRESQL_PASSWORD=${password}

EXPOSE 5432

VOLUME ["/var/lib/pgsql/data"]
