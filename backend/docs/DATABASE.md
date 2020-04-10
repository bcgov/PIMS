# PIMS API Database

The API uses a Entity Framework Core as the ORM to communicate with the data-source. Currently it is configured and coded to use an MS-SQL database.

- [README](../../database/mssql/README.md)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)
- [Entity Provider - MS-SQL](https://docs.microsoft.com/en-us/ef/core/providers/sql-server/?tabs=dotnet-core-cli)
- [Docker Hub - MS-SQL](https://hub.docker.com/_/microsoft-mssql-server)

## Database Initialization

When the API starts it will attempt to setup and configure the database based on the connection string set above, if the environment is not _Production_ (i.e. _Development_).

It is possible with some changes to use a different type of database. Refer to the database documentation [here](../database/README.md).

Refer to the CLI documentation [here](https://docs.microsoft.com/en-us/ef/core/miscellaneous/cli/dotnet).

## Database Migration Management

The database is setup and configured through Entity Framework Code-First processes. To use the Entity Framework CLI you will need to:

- Install the **.NET SDK version** (download links below), 
- Install **dotnet-ef tool** and,
- Add a `connectionstrings.json` configuration file in the `/backend/dal` folder 
  - *Alternatively, the connection string can also be included in a `.env` file in the same folder.*

**NOTE** - All `dotnet ef ` commands must be run from the `/backend/dal` directory.

**NOTE** - Please do not commit the `connectionstrings.json` file to source code. It is likely to contain secret information that should not be shared. By default `.gitignore` will exclude it.

Install the .NET SDK

> [download .NET Core SDK - 3.0](https://dotnet.microsoft.com/download/dotnet-core/3.0)

> [download .NET Core SDK - 3.1](https://dotnet.microsoft.com/download/dotnet-core/3.1)

Install the `dotnet-ef` CLI

```bash
dotnet tool install --global dotnet-ef
```

You may create a `connectionstrings.json` configuration file within the `/backend/dal` project, or a `.env` file to contain this information. You can also create one for each environment by creating a file with the naming convention `connectionstrings.[Environment].json`. Enter the following information into the file;

```json
{
  "ConnectionStrings": {
    "PIMS": "Server=<localhost or host.docker.internal>,<port>;User ID=sa;Database=<database name>"
  }
}
```

The default `port` for MS-SQL is 1433, but set it to the same value used in the `docker-compose.yaml` configuration file.
The `database name` should be the same value using the in the database `.env` file.

### Entity Framework CLI Information

`dotnet ef` must be installed as a global or local tool. Most developers will install `dotnet ef` as a global tool with the following command:

Use bash, CMD.exe or PowerShell for specific version:

```bash
dotnet tool update --global dotnet-ef --version 3.1.0
```

or for latest version use (works also for reinstallation):

```bash
dotnet tool update --global dotnet-ef
```

Set the environment path so that the tool is executable.

For **Linux** and **macOS**, add a line to your shell's configuration:

```bash
export PATH="$PATH:$HOME/.dotnet/tools/"
```

For **Windows**:

You need to add `%USERPROFILE%\.dotnet\tools` to the `PATH`.

### Useful Commands

*Make sure you have a properly configured `connectionstrings.json` or `.env` file in the `/backend/dal`folder.*

To kill your database and start over;

```bash
dotnet ef database drop --force
dotnet ef database update
```

The following example creates a SQL script for the Initial migration;

```bash
dotnet ef migrations script 0 Initial
```

**IMPORTANT** - In order for initial seeding and post migration SQL scripts to run, the first migration must be named **Initial** (case-sensitive)

The following example creates SQL scripts for all migrations after the Initial migration;

```bash
dotnet ef migrations script 20180904195021_Initial
```

### Creating New Database Migrations

To add a new database code migration do the following;

Go to the `/backend/dal` folder. Enter the name of the migration you want to create `[name]`.

```bash
dotnet ef migrations add [name]
```

You should then edit the migration you created `[20200204191656_name].cs` to inherit from PIMS `SeedMigration` class. 

*This will enable running SQL scripts during migration, for either complex database changes, or seed data.*

```csharp
using System;
using Microsoft.EntityFrameworkCore.Migrations;
// Add this using statement.
using Pims.Api.Helpers.Migrations;

namespace Pims.Api.Migrations
{
    // Inherit from SeedMigration
    public partial class Initial : SeedMigration
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

### Adding custom SQL scripts

Any SQL scripts that you want to run as part of a migration must be additionally included as build content in the project file.

- Edit the `Pims.Dal.csproj` file and;
- Add the `<Content>` location with a `<CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>` (see below example). 

**NOTE** - By default all `*.sql` files within the `/backend/dal/Migrations` folder will be included in the project as Content.

```xml
<?xml version="1.0" encoding="utf-8"?>
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>netcoreapp3.1</TargetFramework>
  </PropertyGroup>
  ...
  <ItemGroup>
    <Content Include="Migrations\**\*.sql">
      <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
    </Content>
  </ItemGroup>
</Project>
```
