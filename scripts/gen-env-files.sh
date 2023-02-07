#!/bin/bash

# Set environment variables.
# Docker Compose
if test -f "./.env"; then
    echo "./.env exists"
else
echo \
"DATABASE_PORT=5433
API_HTTP_PORT=5000
API_HTTPS_PORT=5001
APP_HTTP_PORT=3000" >> ./.env
fi

# API Database
if test -f "./database/mssql/.env"; then
    echo "./database/mssql/.env exists"
else
echo \
"ACCEPT_EULA=Y
MSSQL_SA_PASSWORD=MWIxZWFlNTZiOTU3YTZmODEyZDUxYA8!
MSSQL_PID=Developer
TZ=America/Los_Angeles
DB_NAME=pims
DB_USER=admin
DB_PASSWORD=MWIxZWFlNTZiOTU3YTZmODEyZDUxYA8!
TIMEOUT_LENGTH=120" >> ./database/mssql/.env
fi

# API
if test -f "./backend/api/.env"; then
    echo "./backend/api/.env exists"
else
echo \
"ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://*:8080
DB_PASSWORD=MWIxZWFlNTZiOTU3YTZmODEyZDUxYA8!
Keycloak__Secret=
Keycloak__ServiceAccount__Secret=
Keycloak__FrontendClientId=
#Ches__Username=
#Ches__Password=
#Ches__OverrideTo=" >> ./backend/api/.env
fi

# DAL DB migration
if test -f "./backend/dal/.env"; then
    echo "./backend/dal/.env exists"
else
echo \

"ConnectionStrings__PIMS=Server=localhost,5433;Database=pims;User Id=admin;

DB_PASSWORD=MWIxZWFlNTZiOTU3YTZmODEyZDUxYA8!" >> ./backend/dal/.env
fi

# Application
if test -f "./frontend/.env"; then
    echo "./frontend/.env exists"
else
echo \
"NODE_ENV=development
API_URL=http://backend:8080/
CHOKIDAR_USEPOLLING=true
REACT_APP_KEYCLOAK_CLIENT_ID=pims-local-test-4292
REACT_APP_KEYCLOAK_AUTH_SERVER_URL=https://dev.loginproxy.gov.bc.ca/auth" >> ./frontend/.env
fi

echo 'Before running all the docker containers, update the .env files with the Keycloak Client Secret (pims-service-account).'