# PIMS RESTful API - .NET CORE

The PIMS API provides an RESTful interface to interact with the configured data-source.

The API is configured to run in a Docker container and has the following dependencies with other containers; database, keycloak.

For more information refer to documentation [here](https://github.com/bcgov/PIMS/wiki/api/API.md).

To run the API locally you will need to create the appropriate environment variable `.env` files. You can do this through using the prebuilt scripts [here](../../scripts/README.md).

## API Environment Variables

The current environment is initialized through the environment variable `ASPNETCORE_ENVIRONMENT`.

When running the solution it applies the configuration setting in the following order;

> NOTE: When the environment is Development it will look for your _User Secrets_ file.

1. appsettings.json
2. appsettings.`[environment]`.json
3. User Secrets `(if environment=Development)`
4. Environment Variables

To run the solution with docker-compose create a `.env` file within the `/api` directory and populate with the following;

```conf
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://*:8080
ASPNETCORE_FORWARDEDHEADERS_ENABLED=true
DB_PASSWORD={password}
ConnectionStrings__PIMS={connection string}
Keycloak__Secret={secret}
Keycloak__ServiceAccount__Secret={secret}
```

| Key                                 | Required | Value                              | Description                                                                                                                                                 |
| ----------------------------------- | :------: | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ASPNETCORE_ENVIRONMENT              |    x     | [Development\|Staging\|Production] | The environment name to run under. This will result in apply different configuration settings.                                                              |
| ASPNETCORE_URLS                     |    x     | {http://*:8080}                    | The host addresses with ports and protocols that the server will listen to.                                                                                 |
| ASPNETCORE_FORWARDEDHEADERS_ENABLED |          | [true\|false]                      | Whether to include forwarder headers.                                                                                                                       |
| DB_PASSWORD                         |    x     | {password}                         | The password to the database. If using MSSQL it will require a complex password. Needs to be the same value found in the `/database/.../.env` file.         |
| ConnectionStrings\_\_PIMS           |          | {connection string}                | To override the `appsettings.[environment].json` configuration files you can set the connection string value here.                                          |
| Keycloak\_\_Secret                  |    x     | {secret}                           | Should be the value provided by KeyCloak (_Currently this value can remain blank_)                                                                          |
| Keycloak\_\_ServiceAccout\_\_Secret |    x     | {secret}                           | Should be the value provided by KeyCloak for the _pims-service-account_ client. This is required for administrative endpoints that integrate with Keycloak. |

## Secret Management

If you want to keep private keys and user secrets out of source code use the **user-secrets** management tool.
Please note this will only work if the _environment=Development_, and it does not appear to be currently working all the time within vscode.

```bash
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:PIMS" "Server=localhost,<port>;User ID=sa;Database=<database name>"
```

## Running Locally

to run the API locally with vscode, comment out the following lines, and add the `ConnectionStrings__PIMS` value in your `.env` file;

```conf
# ASPNETCORE_ENVIRONMENT=Development
# ASPNETCORE_URLS=http://*:8080
ConnectionStrings__PIMS=Server=localhost,5433;Database=pims;User Id=sa;
```

This is so that the `/.vscode/launch.json` configured environment variables are used instead. Specifically it will run with the following;

```json
{
    "configurations": [{
        ...
        "env": {
            "ASPNETCORE_ENVIRONMENT": "Local",
            "ASPNETCORE_URLS": "http://*:5000"
        }
        ...
    }]
}
```
