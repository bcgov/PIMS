#!/bin/bash

echo 'Enter a username for the keycloak database.'
read -p 'Username: ' varKeycloakDb

echo 'Enter a username for the keycloak realm administrator'
read -p 'Username: ' varKeycloak

echo 'Enter a username for the API database.'
read -p 'Username: ' varApiDb

# Generate a random password that satisfies MSSQL password requirements.
echo 'A password is randomly being generated.'
passvar=$(date +%s | sha256sum | base64 | head -c 29)A8!
echo $passvar

# Set environment variables.
# Keycloak
if test -f "./auth/keycloak/.env"; then
    echo "./auth/keycloak/.env exists"
else
echo \
"PROXY_ADDRESS_FORWARDING=true
# DB_VENDOR=POSTGRES
# DB_ADDR=keycloak-db
# DB_DATABASE=keycloak
# DB_USER=$varKeycloakDb
# DB_PASSWORD=$passvar
KEYCLOAK_USER=$varKeycloak
KEYCLOAK_PASSWORD=$passvar
KEYCLOAK_IMPORT=/tmp/realm-export.json -Dkeycloak.profile.feature.scripts=enabled -Dkeycloak.profile.feature.upload_scripts=enabled
KEYCLOAK_LOGLEVEL=WARN
ROOT_LOGLEVEL=WARN" >> ./auth/keycloak/.env
fi

# Keycloak Database
if test -f "./auth/postgres/.env"; then
    echo "./auth/postgres/.env exists"
else
echo \
"POSTGRESQL_DATABASE=keycloak
POSTGRESQL_USER=$varKeycloakDb
POSTGRESQL_PASSWORD=$passvar
" >> ./auth/postgres/.env
fi

# API Database
if test -f "./database/mssql/.env"; then
    echo "./database/mssql/.env exists"
else
echo \
"ACCEPT_EULA=Y
MSSQL_SA_PASSWORD=$passvar
MSSQL_PID=Developer
TZ=America/Los_Angeles
DB_NAME=pims
DB_USER=admin
DB_PASSWORD=$passvar
TIMEOUT_LENGTH=120" >> ./database/mssql/.env
fi

# API Database
if test -f "./database/postgres/.env"; then
    echo "./database/postgres/.env exists"
else
echo \
"POSTGRES_USER=$varApiDb
POSTGRES_PASSWORD=$passvar
POSTGRES_DB=pims" >> ./database/postgres/.env
fi

# API
if test -f "./backend/api/.env"; then
    echo "./backend/api/.env exists"
else
echo \
"ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://*:8080
DB_PASSWORD=$passvar
Keycloak__Secret=
Keycloak__ServiceAccount__Secret=" >> ./backend/api/.env
fi

# DAL DB migration
if test -f "./backend/dal/.env"; then
    echo "./backend/dal/.env exists"
else
echo \
"ConnectionStrings__PIMS=Server=localhost,5433;Database=pims;User Id=$varApiDb;
DB_PASSWORD=$passvar" >> ./backend/dal/.env
fi

# Application
if test -f "./frontend/.env"; then
    echo "./frontend/.env exists"
else
echo \
"NODE_ENV=development
API_URL=http://backend:8080/
CHOKIDAR_USEPOLLING=true" >> ./frontend/.env
fi

# Import tool
if test -f "./tools/import/.env"; then
    echo "./tools/import/.env exists"
else
echo \
"Import__Quantity=50
# Import__Skip=8500
# Import__Delay=3000

# Local
ASPNETCORE_ENVIRONMENT=Local
Auth__Keycloak__Secret=

# Property Import
Import__File=./Data/properties-todds.json

# Project Import
# Import__File=./Data/projects.json
# Api__ImportUrl=/tools/import/projects?stopOnError=false&defaults=workflow=SPL" >> ./tools/import/.env
fi

# Keycloak sync tool
if test -f "./tools/keycloak/sync/.env"; then
    echo "./tools/keycloak/sync/.env exists"
else
echo \
"# Local
ASPNETCORE_ENVIRONMENT=Local
Auth__Keycloak__Secret=" >> ./tools/keycloak/sync/.env
fi

echo 'Before running all the docker containers, update the .env files with the Keycloak Client Secret (pims-service-account).'
