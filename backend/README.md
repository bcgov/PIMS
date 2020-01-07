# RESTful API - .NET CORE

# Setup

Create a .env file and populate it with this.

```
ASPNETCORE_ENVIRONMENT=Development
ConnectionStrings__GeoSpatial=Host=host.docker.internal;Port=5433;Username=postgres;Password=password;Database=geospatial;
Keycloak__Secret=6d182cfd-c085-4c2b-a4f7-65ac245cf68a
```

## Secret Management

To keep private keys and user secrets out of source code use the _user-secrets_ management tool.

> `dotnet user-secrets init` >`dotnet user-secrets set "ConnectionStrings:GeoSpatial" "Host=host.docker.internal;Port=5433;Username=postgres;Password=password;Database=geospatial;"`

## Docker Database Migration Information

Use command line, Cmd or PowerShell for specific version:

> `dotnet tool update --global dotnet-ef --version 3.1.0`

or for latest version use (works also for reinstallation):

> `dotnet tool update --global dotnet-ef`

Set the environment path so that the tool is executable.

> `ENV PATH="$PATH:/root/.dotnet/tools"`
