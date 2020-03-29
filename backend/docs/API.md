# PIMS API

The PIMS backend is supported by a RESTful API developed in .NET Core 3.1.

## Versioning

Versioning is supported through route paths.

See Microsoft's AspNet Api Versioning plugin [here](https://github.com/microsoft/aspnet-api-versioning/wiki).

## Swagger

The API is documented with Open API.

### Swagger UI

`{scheme}://{host}:{port}/api/swagger`

-  [DEV](pims-dev.pathfinder.gov.bc.ca/api/swagger)
-  [TEST](pims-test.pathfinder.gov.bc.ca/api/swagger) [NOT AVAILABLE]
-  [PROD](pims.pathfinder.gov.bc.ca/api/swagger) [NOT AVAILABLE]

## Healthchecks

The API is monitored through an internal healthcheck library.
The project HealthChecks.UI is a minimal UI interface that stores and shows the health checks results from the configured HealthChecks uris.

See Microsoft AspNet Diagnostics Health Checks [here](https://github.com/Xabaril/AspNetCore.Diagnostics.HealthChecks/blob/master/README.md).

### Health Check UI

`{scheme}://{host}:{port}/api/healthchecks-ui`

- [DEV](pims-dev.pathfinder.gov.bc.ca/api/healthchecks-ui)
- [TEST](pims-test.pathfinder.gov.bc.ca/api/healthchecks-ui) [NOT AVAILABLE]
- [PROD](pims.pathfinder.gov.bc.ca/api/healthchecks-ui) [NOT AVAILABLE]

