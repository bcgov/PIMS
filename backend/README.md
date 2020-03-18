# PIMS RESTful API - .NET CORE

The PIMS API provides an RESTful interface to interact with the configured data-source.

The API is configured to run in a Docker container and has the following dependencies with other containers; database, keycloak.

## Table of Contents

- [Setup](./docs/SETUP.md) - How to get up and running.
- [API](./docs/API.md) - API information.
- [Database](./docs/DATABASE.md) - How to manage the database and data migrations.
- [DAL](./docs/DAL.md) - Data Access Layer information.
- [Tools](./docs/TOOLS.md) - Tooling information.
- [Versioning](./docs/VERSIONING.md) - Version information.

## Health Checks UI

Health checks are configured to run against /api/live and /api/ready endpoints. These correspond to the kubernetes concepts of liveliness and readiness, see [here](https://docs.openshift.com/container-platform/3.11/dev_guide/application_health.html). 

Health Checks UI is a UI wrapper around the above health check endpoints. Configuration is provided within appsettings.json. The webhook URI should be provided separately as an environment variable `HealthChecksUI__Webhooks__0__Uri`. See [here](https://github.com/Xabaril/AspNetCore.Diagnostics.HealthChecks#webhooks-and-failure-notifications) for more information about the structure of the Payload and RestorePayload configuration options.
