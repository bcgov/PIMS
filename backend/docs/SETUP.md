# PIMS API Setup

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
ASPNETCORE_FORWARDEDHEADERS_ENABLED=true
DB_PASSWORD={password}
ConnectionStrings__PIMS={connection string}
Keycloak__Secret={secret}
```

| Key                                 | Value                              | Description                                                                                                                                         |
| ----------------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| ASPNETCORE_ENVIRONMENT              | [Development\|Staging\|Production] | The environment name to run under. This will result in apply different configuration settings.                                                      |
| ASPNETCORE_FORWARDEDHEADERS_ENABLED | [true\|false]                      | Whether to include forwarder headers.                                                                                                               |
| DB_PASSWORD                         | {password}                         | The password to the database. If using MSSQL it will require a complex password. Needs to be the same value found in the `/database/.../.env` file. |
| ConnectionStrings\_\_PIMS           | {connection string}                | To override the `appsettings.[environment].json` configuration files you can set the connection string value here.                                  |
| Keycloak\_\_Secret                  | {secret}                           | Should be the value provided by KeyCloak (_Currently this value can remain blank_)                                                                  |

## Secret Management

If you want to keep private keys and user secrets out of source code use the **user-secrets** management tool.
Please note this will only work if the _environment=Development_, and it does not appear to be currently working all the time within vscode.

```bash
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:PIMS" "Server=localhost,<port>;User ID=sa;Database=<database name>"
```
