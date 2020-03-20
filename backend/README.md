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

## Static Code Analysis with SonarQube

[SonarQube](http://www.sonarqube.org/) is an open-source automatic code review tool to detect bugs, vulnerabilities and code smells in your code. It can integrate with your existing workflow to enable continuous code inspection across your project branches and pull requests.

##### What does analysis produce?

SonarQube can perform analysis on up to 27 different languages. The outcome of this analysis will be quality measures and issues (instances where coding rules were broken).

PIMS SonarQube dashboard is available [here](https://sonarqube-jcxjin-tools.pathfinder.gov.bc.ca/projects)

##### Installing SonarScanner for MSBuild

There are several options to install [SonnarScanner for MSBuild](https://sonarcloud.io/documentation/analysis/scan/sonarscanner-for-msbuild/). 

The simplest way is to install it as global tool for .NET Core;

```bash
dotnet tool install --global dotnet-sonarscanner
```

##### Triggering a manual scan on the NET Core backend API

Follow the commands below to trigger a manual scan of PIMS API. 

When the scan is completed the results will be available on [PIMS SonarQube Dashboard](https://sonarqube-jcxjin-tools.pathfinder.gov.bc.ca/projects?sort=-analysis_date)

```bash
cd backend

dotnet sonarscanner begin -k:"bcgov_PIMS_API" \
  -d:sonar.host.url="https://sonarqube-jcxjin-tools.pathfinder.gov.bc.ca" \
  -d:sonar.login="{token}"
  
dotnet build --no-incremental

dotnet sonarscanner end -d:sonar.login="{token}"
```