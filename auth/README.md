# Setup
Create a .env file and populate it with this.

```
# Keycloak configuration
DB_VENDOR=POSTGRES
DB_ADDR=keycloak-db
DB_DATABASE=keycloak
DB_USER=keycloak
DB_PASSWORD=password

KEYCLOAK_USER=keycloak
KEYCLOAK_PASSWORD=password
KEYCLOAK_IMPORT=/tmp/realm-export.json
KEYCLOAK_LOGLEVEL=WARN
ROOT_LOGLEVEL=WARN

# Keycloak PostgreSQL configuration
POSTGRESQL_DATABASE=keycloak
POSTGRESQL_USER=keycloak
POSTGRESQL_PASSWORD=password
```
