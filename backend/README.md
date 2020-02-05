# RESTful API - .NET CORE

# Setup

Create a .env file and populate it with this.

```
ASPNETCORE_ENVIRONMENT=Development
ConnectionStrings__GeoSpatial=Host=host.docker.internal;Port=5433;Username=sa;Password=[password];Database=geospatial;
Keycloak__Secret=[secret]
```

## Secret Management

To keep private keys and user secrets out of source code use the **user-secrets** management tool.

You will need to use secrets if you want to be able to use the `dotnet ef` CLI tools.

> `dotnet user-secrets init` 

>`dotnet user-secrets set "ConnectionStrings:GeoSpatial" "Host=host.docker.internal;Port=5433;Username=sa;Password=[password];Database=geospatial;"`

## Docker Database Migration Information

Use command line, Cmd or PowerShell for specific version:

> `dotnet tool update --global dotnet-ef --version 3.1.0`

or for latest version use (works also for reinstallation):

> `dotnet tool update --global dotnet-ef`

Set the environment path so that the tool is executable.

> `ENV PATH="$PATH:/root/.dotnet/tools"`

## Database Configuration
The API uses a DB to store data.  Currently it is configured and coded to use an MSSQL database.

When the API starts it will attempt to setup and configure the database based on the connection string set above.

It is possible with some changes to use a different type of database.  Refer to the database documentat [here](../database/README.md).

Refer to the CLI documentation [here](https://docs.microsoft.com/en-us/ef/core/miscellaneous/cli/dotnet).

### Useful commands
Kill your database and start over.

> `dotnet ef database drop --force`

> `dotnet ef database update`

Generate the SQL for the migration.

> `dotnet ef migrations script 0 initial`

Or for all migrations after the initial migration.

> `dotnet ef migrations script 20180904195021_initial`
