# >docker build -t keycloak-db .
# >docker run --env-file=../../.env -d keycloak-db
# https://hub.docker.com/r/centos/postgresql-10-centos7
FROM registry.access.redhat.com/rhscl/postgresql-10-rhel7:latest

EXPOSE 5432

VOLUME ["/var/lib/pgsql/data"]
