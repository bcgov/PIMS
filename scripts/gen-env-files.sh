#!/bin/bash

# Set environment variables.
if test -f "./auth/keycloak/.env"; then
    echo "./auth/keycloak/.env exists"
else
echo \
"PROXY_ADDRESS_FORWARDING=true
DB_VENDOR=POSTGRES
DB_ADDR=keycloak-db
DB_DATABASE=keycloak
DB_USER=keycloak
DB_PASSWORD=password
KEYCLOAK_USER=keycloak
KEYCLOAK_PASSWORD=password
KEYCLOAK_IMPORT=/tmp/realm-export.json
KEYCLOAK_LOGLEVEL=WARN
ROOT_LOGLEVEL=WARN" >> ./auth/keycloak/.env
fi

if test -f "./auth/postgres/.env"; then
    echo "./auth/postgres/.env exists"
else
echo \
"POSTGRESQL_DATABASE=keycloak
POSTGRESQL_USER=keycloak
POSTGRESQL_PASSWORD=password
" >> ./auth/postgres/.env
fi

if test -f "./database/mssql/.env"; then
    echo "./database/mssql/.env exists"
else
echo \
"ACCEPT_EULA=Y
MSSQL_SA_PASSWORD=AC0m934#9(sdf]|
MSSQL_PID=Developer" >> ./database/mssql/.env
fi

if test -f "./database/postgres/.env"; then
    echo "./database/postgres/.env exists"
else
echo \
"POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=geospatial" >> ./database/postgres/.env
fi

if test -f "./backend/api/.env"; then
    echo "./backend/api/.env exists"
else
echo \
"ASPNETCORE_ENVIRONMENT=Development
DB_PASSWORD=AC0m934#9(sdf]|
ConnectionStrings__PIMS=Server=database,1433;Database=geospatial;User Id=sa
Keycloak__Secret=6d182cfd-c085-4c2b-a4f7-65ac245cf68a" >> ./backend/.env
fi

if test -f "./frontend/.env"; then
    echo "./frontend/.env exists"
else
echo \
"NODE_ENV=development
API_URL=http://backend:5000/api
CHOKIDAR_USEPOLLING=true" >> ./frontend/.env
fi

