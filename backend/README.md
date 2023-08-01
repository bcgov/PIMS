# PIMS RESTful API - .NET CORE

The PIMS API provides an RESTful interface to interact with the configured data-source.

The API is configured to run in a Docker container and has the following dependencies with other containers; database.

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
ConnectionStrings__PIMS={connection string} # For local debugging in VSCode

ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://*:8080 #http://*:8081 for debugging
DB_PASSWORD={password}

Keycloak__Secret={secret}
Keycloak__ServiceAccount__Secret={secret}
Keycloak__FrontendClientId={client id}

Ches__Username={secret}
Ches__Password={password}
Ches__OverrideTo={email}

Ltsa__IntegratorUsername={username}
Ltsa__IntegratorPassword={password}
Ltsa__UserName={username}
Ltsa__UserPassword={password}
```

| Key                                 | Required | Value                              | Description                                                                                                                                                 |
| ----------------------------------- | :------: | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ASPNETCORE_ENVIRONMENT              |    x     | [Development\|Staging\|Production] | The environment name to run under. This will result in apply different configuration settings.                                                              |
| ASPNETCORE_URLS                     |    x     | {http://*:8080}                    | The host addresses with ports and protocols that the server will listen to.                                                                                 |
| DB_PASSWORD                         |    x     | {password}                         | The password to the database. If using MSSQL it will require a complex password. Needs to be the same value found in the `/database/mssql/.env` file.       |
| ConnectionStrings\_\_PIMS           |          | {connection string}                | To override the `appsettings.[environment].json` configuration files you can set the connection string value here.                                          |


## Running Locally

To run the API locally with vscode, comment out the following lines, and add the `ConnectionStrings__PIMS` value in your `.env` file;

```conf
# ASPNETCORE_ENVIRONMENT=Development
# ASPNETCORE_URLS=http://*:8080
ConnectionStrings__PIMS=Server=localhost,5433;Database=pims;User ID=admin;Encrypt=False
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
