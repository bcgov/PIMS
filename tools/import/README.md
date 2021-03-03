# PIMS Import Tool

The PIMS Import Tool provides a way to parse a JSON file containing an array of items and send bundled HTTP requests to a configured API endpoint for the purpose of importing data.

This console application can send any type of array of JSON objects to any API endpoint.

Use this console application to import inventory data into PIMS.

## Configuration

Some of these settings have default values contained in the `appsettings.json` configuration files.

| Key                                                  | Type   | Default                                | Description                                                                                       |
| ---------------------------------------------------- | ------ | -------------------------------------- | ------------------------------------------------------------------------------------------------- |
| ASPNETCORE_ENVIRONMENT                               | string | [Local, Development, Test, Production] | The environment controls what configuration files is used                                         |
| Api\_\_Uri                                           | URI    | environment specific                   | The URI to the PIMS API                                                                           |
| Api\_\_ImportUrl                                     | URI    | environment specific                   | The URL to the endpoint you want to send the request to.                                          |
| Api\_\_HttpMethod                                    | string | [GET, PUT, POST, **DELETE**]           | HTTP Method to use in the request (default: POST).                                                |
| Auth*\_OpenIdConnect*\_Token                         | URI    | environment specific                   | The URI to the Keycloak Token Request endpoint                                                    |
| Auth*\_Keycloak*\_Realm                              | string | environment specific                   | The Keycloak Realm name                                                                           |
| Auth*\_Keycloak*\_Authority                          | URI    | environment specific                   | The URI to the Keycloak authority instance                                                        |
| Auth*\_Keycloak*\_Audience                           | string | pims-service-account                   | The name of the Keycloak service account                                                          |
| Auth*\_Keycloak*\_Client                             | string | pims-service-account                   | The name of the Keycloak service account                                                          |
| Auth*\_Keycloak*\_Secret                             | string | environment specific                   | The Keycloak service account client secret                                                        |
| Auth*\_Keycloak*\_Admin\_\_Authority                 | URI    | environment specific                   | The URI to the Keycloak Admin authority instance                                                  |
| RetryAfterFailures                                   | bool   | true                                   | Whether to retry after a failure                                                                  |
| RetryAttempts                                        | number | 2                                      | How many attempts will be made before a failure is logged                                         |
| AbortAfterFailure                                    | number | 1                                      | How many failures should be allowed before aborting process                                       |
| Import\_\_File                                       | string |                                        | The path to the JSON file to parse and iterate through. The JSON should be an array of items.     |
| Import\_\_Delay                                      | number | 0                                      | The number of seconds to delay between each request (default: 0).                                 |
| Import\_\_Quantity                                   | number | 50                                     | The number of items to send in each request (default: 50, max: 100)                               |
| Import\_\_Skip                                       | number | 0                                      | The number of items to skip in the imported JSON array.                                           |
| Import\_\_Iterations                                 | number | 0                                      | The number of requests to make before cancelling the import (default = 0, which means don't stop) |
| Serialization\_\_Json\_\_IgnoreNullValues            | bool   | true                                   | Whether to ignore null values when serializing JSON [true, false].                                |
| Serialization\_\_Json\_\_PropertyNameCaseInsensitive | bool   | true                                   | Whether to ignore case sensitivity when deserializing JSON [true, false].                         |
| Serialization\_\_Json\_\_PropertyNamingPolicy        | string | CamelCase                              | What property naming policy to use when serializing JSON [CamelCase].                             |
| Serialization\_\_Json\_\_WriteIndented               | bool   | true                                   | Whether to indent serialized JSON [true, false].                                                  |

If you prefer, you can add your JSON files to the `/backend/tools/import/Data` folder and they will be ignored by **git**.

## Run

Create a `.env` file and populate it with the following;

```
ASPNETCORE_ENVIRONMENT=Local
Auth__OpenIdConnect__Token={URL to Keycloak token endpoint (i.e. https://dev.oidc.gov.bc.ca/auth/realms/quartech/protocol/openid-connect/token)}
Auth__Keycloak__Client={Keycloak client ID (i.e. pims-service-account)}
Auth__Keycloak__Secret={Keycloak client secret}
Api__ImportUrl={URL to endpoint (i.e. http://pims-dev.apps.silver.devops.gov.bc.ca/api/tools/import/properties)}
Import__File=./Data/properties.json
```

The minimum `.env` configuration if you used most of the defaults is as following;

```
ASPNETCORE_ENVIRONMENT=Local
Auth__Keycloak__Secret={Keycloak client secret}
```

To run the application ensure the configuration files are present and the JSON data file is in the correct location (i.e. the `/Data` folder).

```bash
dotnet run
```

Alternatively, you can execute the compiled build directly if you have your environment variables setup.

```bash
Pims.Tools.Import.exe
```

## Makefile

A `Makefile` is provided within this folder to automate the process of:

- Requesting a keycloak token for **pims-service-account**
- Activating the service account via an API call
- Seeding the docker database via `dotnet run`

#### Available commands

```bash
make run
```

If you need to troubleshoot;

```bash
make token
# Your JWT token is: ey7hb....a1Q
make help
```

#### Requirements

For the `Makefile` to work you will need to:

1. Ensure a valid `[.env]` file is present;

2. Ensure the solution is currently running in docker; i.e `docker-compose up -d`

3. Ensure **Make** is installed in your shell. It comes pre-installed on macOS. For Windows, you can install `gnu-make` via [chocolatey](https://chocolatey.org/) or [scoop](https://scoop.sh/)

   ```bash
   choco install make
   # -OR-
   scoop install make
   ```

_Alternatively, you can follow the instructions below to seed the database manually_
