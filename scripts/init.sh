#!/bin/bash

# Set environment variables.
if test -f "./auth/.env"; then
    echo "./auth/.env exists"
else
echo \
"POSTGRESQL_DATABASE=keycloak
POSTGRESQL_USER=keycloak
POSTGRESQL_PASSWORD=password
DB_VENDOR=POSTGRES
DB_ADDR=keycloak-db
DB_DATABASE=keycloak
DB_USER=keycloak
DB_PASSWORD=password
KEYCLOAK_USER=keycloak
KEYCLOAK_PASSWORD=password
KEYCLOAK_IMPORT=/tmp/realm-export.json
KEYCLOAK_LOGLEVEL=WARN
ROOT_LOGLEVEL=WARN" >> "./auth/.env"
fi

if test -f "./database/.env"; then
    echo "./database/.env exists"
else
echo \
"POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=geospatial" >> ./database/.env
fi

if test -f "./backend/.env"; then
    echo "./backend/.env exists"
else
echo \
"ASPNETCORE_ENVIRONMENT=Development
ConnectionStrings__GeoSpatial=Host=host.docker.internal;Port=5433;Username=postgres;Password=password;Database=geospatial;
Keycloak__Secret=6d182cfd-c085-4c2b-a4f7-65ac245cf68a" >> ./backend/.env
fi

if test -f "./frontend/.env"; then
    echo "./frontend/.env exists"
else
echo \
"NODE_ENV=development
KEYCLOAK_URL=http://host.docker.internal:8080/auth/admin/realms/quartech/users
CHOKIDAR_USEPOLLING=true" >> ./frontend/.env
fi

