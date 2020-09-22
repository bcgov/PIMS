#!/bin/bash

echo 'Enter a username for the keycloak database.'
read -p 'Username: ' varKeycloakDb

echo 'Enter a username for the keycloak realm administrator'
read -p 'Username: ' varKeycloak

echo 'Enter a username for the API database.'
read -p 'Username: ' varApiDb

# Generate a random password.
passvar=$(date +%s | sha256sum | base64 | head -c 32)

# Set environment variables.
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

if test -f "./auth/postgres/.env"; then
    echo "./auth/postgres/.env exists"
else
echo \
"POSTGRESQL_DATABASE=keycloak
POSTGRESQL_USER=$varKeycloakDb
POSTGRESQL_PASSWORD=$passvar
" >> ./auth/postgres/.env
fi

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

if test -f "./database/postgres/.env"; then
    echo "./database/postgres/.env exists"
else
echo \
"POSTGRES_USER=$varApiDb
POSTGRES_PASSWORD=$passvar
POSTGRES_DB=pims" >> ./database/postgres/.env
fi

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

if test -f "./frontend/.env"; then
    echo "./frontend/.env exists"
else
echo \
"NODE_ENV=development
API_URL=http://backend:8080/
CHOKIDAR_USEPOLLING=true" >> ./frontend/.env
fi

