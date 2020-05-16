# PIMS API

The PIMS backend is supported by a RESTful API developed in .NET Core 3.1.

## Versioning

Versioning is supported through route paths.

See Microsoft's AspNet Api Versioning plugin [here](https://github.com/microsoft/aspnet-api-versioning/wiki).

- [Configuration](./VERSIONING.md)
- [Semantic Versioning](../../docs/VERSIONS.md)

## Swagger

The API is documented with Open API.

### Swagger UI

- [DEV](pims-dev.pathfinder.gov.bc.ca/api-docs)
- [TEST](pims-test.pathfinder.gov.bc.ca/api-docs)
- [PROD](pims.gov.bc.ca/api-docs) <span style="color:red">[NOT AVAILABLE]</span>

## Healthchecks

The API is monitored through an internal healthcheck library.
The project HealthChecks.UI is a minimal UI interface that stores and shows the health checks results from the configured HealthChecks uris.

See Microsoft AspNet Diagnostics Health Checks [here](https://github.com/Xabaril/AspNetCore.Diagnostics.HealthChecks/blob/master/README.md).

### Health Check UI - Uptime Robot

- [DEV](https://stats.uptimerobot.com/M7nQzH52nW)
- [TEST](https://stats.uptimerobot.com/M7nQzH52nW) <span style="color:red">[NOT AVAILABLE]</span>
- [PROD](https://stats.uptimerobot.com/M7nQzH52nW) <span style="color:red">[NOT AVAILABLE]</span>
