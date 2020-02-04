# Database
The API requires a database for storing PIMS data.  Currently the choice is to use MSSQL for tighter integration with .NET Core Entity Framework.

Refer to documentation for the database type.
- [MSSQL](mssql/README.md)
- [PostgreSQL](postgres/README.md)

## Issues

Windows doesn't support mounting volumes locally. You have to add a `.env` file to the same directory as the `docker-compose.yml` file. Within that file the `COMPOSE_CONVERT_WINDOWS_PATHS=true` setting.

## Initialize Database

To get the database running and initialized do the following;

- Create a `.env` file in the `/database` folder
- Populate it with the following environment variables specified for the database you select (above);

Go to the `/backend` folder

> `dotnet restore`

> `dotnet build`

> `dotnet ef database update`

## New Migration

To add a new database code migration do the following;

Go to the `/backend` folder.  Enter the name of the migration you want to create `[name]`.

> `dotnet ef migrations add [name]`

You should then edit the migration you created `[20200204191656_name].cs` to inherit from our `SeedMigration` class.  This is to enable running SQL scripts during migration, for either complex db changes, or seed data.

```
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

Edit the `Pims.Api.csproj` file and add the `<Content>` with a `<CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>` (see below example).

```
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
