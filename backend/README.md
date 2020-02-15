# REST API - .NET CORE

The PIMS API provides an interface to interact with the configured datasource.

# Configuration

The current environment is initialized through the environment variable `ASPNETCORE_ENVIRONMENT`.

When running the solution locally it applies the configuration setting in the following order;

1. appsettings.json (within /api)
2. appsettings.`[environment]`.json (within /api)
3. UserSecrets `(if environment=Development)` (within /api and /dal)
4. Environment Variables (within /api and /dal)

To run the solution with docker-compose create a .env file within the /dal and /api directories and populate each with the following;

```conf
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_FORWARDEDHEADERS_ENABLED=true
DB_PASSWORD=<password>
Keycloak__Secret=<secret>
```

The `DB_PASSWORD` should be the same value used in the database `.env` file.
The `Keycloak__Secret` should be the value provided by KeyCloak. Currently this value can remain blank.

## Secret Management

If you want to keep private keys and user secrets out of source code use the **user-secrets** management tool.

> `dotnet user-secrets init`

> `dotnet user-secrets set "ConnectionStrings:PIMS" "Server=localhost,<port>;User ID=sa;Database=<database name>"`

# Database Initalization

The API uses a DB to store data. Currently it is configured and coded to use an MSSQL database.

When the API starts it will attempt to setup and configure the database based on the connection string set above.

It is possible with some changes to use a different type of database. Refer to the database documentation [here](../database/README.md).

Refer to the CLI documentation [here](https://docs.microsoft.com/en-us/ef/core/miscellaneous/cli/dotnet).

# Database Migration Management

The DB is setup and configured through Entity Framework Code-First processes. All dotnet ef commands must be run from the /dal directory.

To use the Entity Framework CLI you will need to install the **.NET SDK version**, **dotnet-ef tool** and add a `connectionstrings.json` configuration file to /dal.

**NOTE** - Please do not commit the `connectionstrings.json` file to source code. It is likely to contain secret information that should not be shared. By default `.gitignore` will exclude it.

Install the .NET SDK

> [download .NET SDK - 3.0](https://dotnet.microsoft.com/download/dotnet-core/3.0)

> [download .NET SDK - 3.1](https://dotnet.microsoft.com/download/dotnet-core/3.1)

Install the `dotnet-ef` CLI

> `dotnet tool install --global dotnet-ef`

Create a `connectionstrings.json` configuration file within the /dal project. You can also create one for each environment by creating a file with the naming conventsion `connectionstrings.[environment].json`. Enter the following information into the file;

```json
{
  "ConnectionStrings": {
    "PIMS": "Server=<localhost or host.docker.internal>,<port>;User ID=sa;Database=<database name>"
  }
}
```

The default `port` for MSSQL is 1433, but set it to the same value used in the `docker-compose.yaml` configuration file.
The `database name` should be the same value using the in the database `.env` file.

## Entity Framework CLI Information

Use command line, Cmd or PowerShell for specific version:

> `dotnet tool update --global dotnet-ef --version 3.1.0`

or for latest version use (works also for reinstallation):

> `dotnet tool update --global dotnet-ef`

Set the environment path so that the tool is executable.

> `ENV PATH="$PATH:/root/.dotnet/tools"`

## Useful Commands

Kill your database and start over.

> `dotnet ef database drop --force`

> `dotnet ef database update`

Generate the SQL for the migration.

> `dotnet ef migrations script 0 initial`

Or for all migrations after the initial migration.

> `dotnet ef migrations script 20180904195021_initial`

## Creating New Database Migrations

To add a new database code migration do the following;

Go to the `/backend/dal` folder. Enter the name of the migration you want to create `[name]`.

> `dotnet ef migrations add [name]`

You should then edit the migration you created `[20200204191656_name].cs` to inherit from our `SeedMigration` class. This is to enable running SQL scripts during migration, for either complex db changes, or seed data.

```csharp
using System;
using Microsoft.EntityFrameworkCore.Migrations;
// Add this using statement.
using Pims.Api.Helpers.Migrations;

namespace Pims.Api.Migrations
{
    // Inherit from SeedMigration
    public partial class initial : SeedMigration
    {
        protected override void Up (MigrationBuilder migrationBuilder)
        {
            // Add the PreDeploy action.
            PreDeploy (migrationBuilder);
            ...
            // If required for complex db changes you can add additional ScriptDeploy(...).
            // ScriptDeploy("{this.DefaultMigrationsPath}/{this.Version}/some/path");
            ...
            // Add the PostDeploy action.
            PostDeploy (migrationBuilder);
        }
    }
}
```

Any script that you want to run must be additionally included as build content in the project file.

Edit the `pims.dal.csproj` file and add the `<Content>` with a `<CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>` (see below example).

```xml
<?xml version="1.0" encoding="utf-8"?>
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>netcoreapp3.1</TargetFramework>
  </PropertyGroup>
  ...
  <ItemGroup>
    <Content Include="Migrations\initial\PostDeploy\01 BuildingConstructionTypes.sql">
      <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
    </Content>
    <Content Include="Migrations\initial\PostDeploy\01 BuildingPredominantUses.sql">
      <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
    </Content>
    <Content Include="Migrations\initial\PostDeploy\01 Cities.sql">
      <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
    </Content>
    <Content Include="Migrations\initial\PostDeploy\01 PropertyStatus.sql">
      <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
    </Content>
    <Content Include="Migrations\initial\PostDeploy\01 PropertyTypes.sql">
      <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
    </Content>
    <Content Include="Migrations\initial\PostDeploy\01 Provinces.sql">
      <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
    </Content>
  </ItemGroup>
</Project>
```
