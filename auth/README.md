# Keycloak

Keycloak provides the authentication and claim based authorization services for PIMS.
It provides an OpenIdConnect architecture to allow for IDIR, BCeID, GitHub and private email accounts to authenticate and login to PIMS.

For local development it only currently supports private email accounts to authenticate.
You can extend this by modifying the Keycloak Realm and Client configuration.

## Host Name Configuration

When running the solution with **localhost** you can create a _host_ name in your _hosts_ file so that Keycloak will validate the JWT token against the correct issuers.
This should be optional based on the keycloak configuration.

Add the following host to your _hosts_ file.

> `127.0.0.1 keycloak`

This will then allow your Keycloak configuration files in the _frontend_:app and _backend_:api to references `http://keycloak:8080` instead of `http://localhost:8080`.
Which will allow your docker containers to use a valid JWT token that can be proxied from the APP to the API to Keycloak.

---

### Chrome Cookie Issue and Workaround

Chrome is now pushing an update that invalidates cookies without the `SameSite` value. This may result in a rejection of the cookie and make it impossible to remain logged in.

To workaround this issue temporarily you can change the Chrome behaviour by **Disabling** the **SameSite by default cookies** setting here - `chrome://flags/#same-site-by-default-cookies`

---

## Docker Setup

To run Keycloak in a Docker container you will need to create two `.env` files, one in the `/auth/keycloak` folder, and the other in the `/auth/postgres` folder.

This will allow Keycloak to initialize with a new PostgreSQL database.

### Keycloak Environment Variables

```conf
# Keycloak configuration
PROXY_ADDRESS_FORWARDING=true
KEYCLOAK_USER={username}
KEYCLOAK_PASSWORD={password}
KEYCLOAK_IMPORT=/tmp/realm-export.json -Dkeycloak.profile.feature.scripts=enabled -Dkeycloak.profile.feature.upload_scripts=enabled
KEYCLOAK_LOGLEVEL=WARN
ROOT_LOGLEVEL=WARN

# Database configuration
# These are optional if you don't want to run a separate database for keycloak.
DB_VENDOR=POSTGRES
DB_ADDR=keycloak-db
DB_DATABASE=keycloak
DB_USER={username}
DB_PASSWORD={password}
```

| Key                      | Value                                                                   | Description                                                                                                                    |
| ------------------------ | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| PROXY_ADDRESS_FORWARDING | [true\|false]                                                           | Informs Keycloak to handle proxy forwarded requests correctly.                                                                 |
| KEYCLOAK_USER            | {keycloak}                                                              | The name of the Keycloak Realm administrator.                                                                                  |
| KEYCLOAK_PASSWORD        | {password}                                                              | The password for the Keycloak Realm administrator.                                                                             |
| KEYCLOAK_IMPORT          | /tmp/real-export.json -Dkeycloak.profile.feature.upload_scripts=enabled | The path to the configuration file to initialize Keycloak with. This also includes an override to enable uploading the script. |
| KEYCLOAK_LOGLEVEL        | [WARN\|ERROR\|INFO]                                                     | The logging level for Keycloak.                                                                                                |
| ROOT_LOGLEVEL            | [WARN\|ERROR\|INFO]                                                     | The logging level for the root user of the container.                                                                          |
| DB_VENDOR                | [POSTGRES\|...]                                                         | The database that Keycloak will use.                                                                                           |
| DB_ADDR                  | {keycloak-db}                                                           | The host name of the Keycloak DB found in the `docker-compose.yaml`                                                            |
| DB_DATABASE              | {keycloak}                                                              | Name of the Keycloak database.                                                                                                 |
| DB_USER                  | {keycloak}                                                              | The name of the default database user administrator.                                                                           |
| DB_PASSWORD              | {password}                                                              | The password for the default database user administrator.                                                                      |

### Keycloak Database Environment Variables

```conf
POSTGRESQL_DATABASE=keycloak
POSTGRESQL_USER={username}
POSTGRESQL_PASSWORD={password}
```

| Key                 | Value      | Description                                                                                             |
| ------------------- | ---------- | ------------------------------------------------------------------------------------------------------- |
| POSTGRESQL_DATABASE | {keycloak} | The name of Keycloak database. Must be the same as the above **DB_DATABASE**                            |
| POSTGRESQL_USER     | {keycloak} | The name of the default database user administrator. Must be the same as the above **DB_USER**          |
| POSTGRESQL_PASSWORD | {password} | The password for the default database user administrator. Must be the same as the above **DB_PASSWORD** |
