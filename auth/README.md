# Keycloak

Keycloak provides the authentication and claim based authorization services for PIMS.
It provides an OpenIdConnect architecture to allow for IDIR, BCeID, GitHub and private email accounts to authenticate and login to PIMS.

For local development it only currently supports private email accounts to authenticate.
You can extend this by modifying the Keycloak Realm and Client configuration.

## Docker Setup

To run Keycloak in a Docker container you will need to create two `.env` files, one in the `/auth/keycloak` folder, and the other in the `/auth/postgres` folder.

This will allow Keycloak to initialize with a new PostgreSQL database.

### Keycloak Environment Variables

```conf
# Keycloak configuration
PROXY_ADDRESS_FORWARDING=true
KEYCLOAK_USER=keycloak
KEYCLOAK_PASSWORD=password
KEYCLOAK_IMPORT=/tmp/realm-export.json
KEYCLOAK_LOGLEVEL=WARN
ROOT_LOGLEVEL=WARN

DB_VENDOR=POSTGRES
DB_ADDR=keycloak-db
DB_DATABASE=keycloak
DB_USER=keycloak
DB_PASSWORD=password
```

| Key                      | Value                 | Description                                                         |
| ------------------------ | --------------------- | ------------------------------------------------------------------- |
| PROXY_ADDRESS_FORWARDING | [true\|false]         | Informs Keycloak to handle proxy forwarded requests correctly.      |
| KEYCLOAK_USER            | {keycloak}            | The name of the Keycloak Realm administrator.                       |
| KEYCLOAK_PASSWORD        | {password}            | The password for the Keycloak Realm administrator.                  |
| KEYCLOAK_IMPORT          | /tmp/real-export.json | The path to the configuration file to initialize Keycloak with.     |
| KEYCLOAK_LOGLEVEL        | [WARN\|ERROR\|INFO]   | The logging level for Keycloak.                                     |
| ROOT_LOGLEVEL            | [WARN\|ERROR\|INFO]   | The logging level for the root user of the container.               |
| DB_VENDOR                | [POSTGRES\|...]       | The database that Keycloak will use.                                |
| DB_ADDR                  | {keycloak-db}         | The host name of the Keycloak DB found in the `docker-compose.yaml` |
| DB_DATABASE              | {keycloak}            | Name of the Keycloak database.                                      |
| DB_USER                  | {keycloak}            | The name of the default database user administrator.                |
| DB_PASSWORD              | {password}            | The password for the default database user administrator.           |

### Keycloak Database Environment Variables

```conf
POSTGRESQL_DATABASE=keycloak
POSTGRESQL_USER=keycloak
POSTGRESQL_PASSWORD=password
```

| Key                 | Value      | Description                                                                                             |
| ------------------- | ---------- | ------------------------------------------------------------------------------------------------------- |
| POSTGRESQL_DATABASE | {keycloak} | The name of Keycloak database. Must be the same as the above **DB_DATABASE**                            |
| POSTGRESQL_USER     | {keycloak} | The name of the default database user administrator. Must be the same as the above **DB_USER**          |
| POSTGRESQL_PASSWORD | {password} | The password for the default database user administrator. Must be the same as the above **DB_PASSWORD** |
