# Multiple Instances

If you want to setup multiple instances of the PIMS solution in any given environment [DEV, TEST, PROD] simply create specific `.env` configuration files and add the objects to OpenShift (details below).

## Parameters

The following parameters are required to be set in the examples below.

| Name                 | Example | Description                                                                                                  |
| -------------------- | :-----: | ------------------------------------------------------------------------------------------------------------ |
| {ENV_NAME}           |   dev   | The environment to deploy the build to.                                                                      |
| {INSTANCE IDENTITY}  |   -01   | A unique identifier for the instance you want to spin up.                                                    |
| {REPO NAME}          |  bcgov  | The GitHub repository name to pull from. This is useful if you want an instance from your own personal fork. |
| {BRANCH NAME}        |   dev   | The branch name you want to pull from.                                                                       |
| {TAG FOR INSTANCE}   |   i01   | A unique tag to identify the images built for this instance.                                                 |
| {KEYCLOAK SA SECRET} |         | The Keycloak Service Account client secret.                                                                  |

### Keycloak Configuration

To support multiple instance you must also update the Keycloak Client `pims-app`.

- Valid Redirect URIs = `https://pims-{ENV_NAME}{INSTANCE IDENTITY}.pathfinder.gov.bc.ca/*`
- Web Origins = `https://pims-{ENV_NAME}{INSTANCE IDENTITY}.pathfinder.gov.bc.ca`

---

## Create Configuration Files

All templates require `.env` files to set the parameter values.
Many of the parameters have default values and are not required in your configuration files.
All parameters have been included to show you all the possible settings available.

### API Database

```bash
oc process -f openshift/templates/pims-db/mssql-deploy.yaml --parameters
```

Create configuration file `/openshift/templates/pims-db/deploy.{INSTANCE IDENTITY}.env`

```conf
APP_NAME=pims
COMP_NAME=db
ENV_NAME={ENV_NAME}
PROJECT_NAMESPACE=jcxjin
ID={INSTANCE IDENTITY}

SQL_SERVER_RUNTIME_IMAGE=mssql-rhel-server:2019-latest

MEMORY_LIMIT=4Gi
VOLUME_CAPACITY=5Gi
```

### API Build

```bash
oc process -f openshift/templates/pims-api/build.yaml --parameters
```

Create configuration file `/openshift/templates/pims-api/build.{INSTANCE IDENTITY}.env`

```conf
APP_NAME=pims
COMP_NAME=api

GIT_REPO_URL=https://github.com/{REPO NAME}/PIMS.git
GIT_REF={BRANCH NAME}
SOURCE_CONTEXT_DIR=backend

DOTNET_BUILDER_IMAGE=dotnet-31-rhel7
DOTNET_BUILDER_TAG=3.1

OUTPUT_IMAGE_TAG={TAG FOR INSTANCE}

DOTNET_STARTUP_PROJECT=api/Pims.Api.csproj
DOTNET_PUBLISH_READYTORUN=true
DOTNET_TEST_PROJECTS=tests/unit/api/Pims.Api.Test.csproj tests/unit/dal/Pims.Dal.Test.csproj
DOTNET_CONFIGURATION=Release

CPU_LIMIT=1
MEMORY_LIMIT=6Gi
```

### API Deploy

```bash
oc process -f openshift/templates/pims-api/deploy.yaml --parameters
```

Create configuration file `/openshift/templates/pims-api/deploy.{INSTANCE IDENTITY}.env`

```conf
APP_NAME=pims
COMP_NAME=api
ENV_NAME={ENV_NAME}
PROJECT_NAMESPACE=jcxjin
ID={INSTANCE IDENTITY}
IMAGE_TAG={TAG FOR INSTANCE}

APP_DOMAIN=pims-{ENV_NAME}{INSTANCE IDENTITY}.pathfinder.gov.bc.ca
APP_PORT=8080
API_PATH=/api

CONNECTION_STRINGS_PIMS=Server=pims-db-{ENV_NAME}{INSTANCE IDENTITY},1433;User ID=sa;Database=pims

ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://*:8080

KEYCLOAK_AUDIENCE=pims-api
KEYCLOAK_AUTHORITY=https://{ENV_NAME}.oidc.gov.bc.ca/auth/realms/xz0xtue5
KEYCLOAK_ADMIN_AUTHORITY=https://{ENV_NAME}.oidc.gov.bc.ca/auth/admin/realms/xz0xtue5
KEYCLOAK_SECRET=
KEYCLOAK_SERVICE_ACCOUNT_SECRET={KEYCLOAK SA SECRET}

HEALTH_SCHEME=HTTP
LIVENESS_PATH=/health/live
READINESS_PATH=/health/ready

CPU_LIMIT=1
MEMORY_LIMIT=4Gi
CPU_REQUEST=100m
MEMORY_REQUEST=2Gi
```

### APP Build

```bash
oc process -f openshift/templates/pims-app/build.yaml --parameters
```

Create configuration file `/openshift/templates/pims-app/build.{INSTANCE IDENTITY}.env`

```conf
APP_NAME=pims
COMP_NAME=app

BUILDIMAGE_NAMESPACE=jcxjin-tools
BUILDIMAGE_NAME=yarn-builder
BUILDIMAGE_TAG=latest

RUNTIMEIMAGE_NAMESPACE=jcxjin-tools
RUNTIMEIMAGE_NAME=nginx-runtime
RUNTIMEIMAGE_TAG=latest

GIT_URL=https://github.com/{REPO NAME}/PIMS.git
GIT_REF={BRANCH NAME}
SOURCE_CONTEXT_DIR=frontend

OUTPUT_IMAGE_TAG={TAG FOR INSTANCE}

CPU_LIMIT=1
MEMORY_LIMIT=6Gi
```

### APP Deploy

```bash
oc process -f openshift/templates/pims-app/deploy.yaml --parameters
```

Create configuration file `/openshift/templates/pims-app/deploy.{INSTANCE IDENTITY}.env`

```conf
APP_NAME=pims
COMP_NAME=app
ENV_NAME={ENV_NAME}
ID={INSTANCE IDENTITY}
IMAGE_TAG={TAG FOR INSTANCE}

APP_DOMAIN=pims-{ENV_NAME}{INSTANCE IDENTITY}.pathfinder.gov.bc.ca
APP_PORT=8080
PROJECT_NAMESPACE=jcxjin

KEYCLOAK_CONFIG_FILE_NAME=keycloak.json
KEYCLOAK_CONFIG_MOUNT_PATH=/tmp/app/dist/

REAL_IP_FROM=172.51.0.0/16
API_URL=
API_PATH=/api

CPU_LIMIT=1
MEMORY_LIMIT=4Gi
CPU_REQUEST=100m
MEMORY_REQUEST=2Gi
```

### Pipeline

```bash
oc process -f openshift/templates/jenkins/generic-pipeline.yaml --parameters
```

Create configuration file `/openshift/templates/jenkins/pipeline.{INSTANCE IDENTITY}.env`

```conf
NAME={PIPELINE NAME}
GITHUB_WEBHOOK_SECRET=
GENERIC_WEBHOOK_SECRET=
GIT_URL=https://github.com/{REPO NAME}/PIMS.git
GIT_REF={BRANCH NAME}
JENKINSFILE_PATH=openshift/3.11/pipelines/Jenkinsfile.cicd

APP_URI=https://pims-{ENV_NAME}{INSTANCE IDENTITY}.pathfinder.gov.bc.ca/
ENV_NAME={ENV_NAME}
```

---

## Create Objects in OpenShift

Run the following commands to create all the objects in OpenShift.

```bash
# API DB
oc process -f openshift/templates/pims-db/mssql-deploy.yaml --param-file=deploy.{INSTANCE IDENTITY}.env | oc create --save-config=true -f -
# API
oc process -f openshift/templates/pims-api/build.yaml --param-file=build.{INSTANCE IDENTITY}.env | oc create --save-config=true -f -
oc process -f openshift/templates/pims-api/deploy.yaml --param-file=deploy.{INSTANCE IDENTITY}.env | oc create --save-config=true -f -
# APP
oc process -f openshift/templates/pims-app/build.yaml --param-file=build.{INSTANCE IDENTITY}.env | oc create --save-config=true -f -
oc process -f openshift/templates/pims-app/deploy.yaml --param-file=deploy.{INSTANCE IDENTITY}.env | oc create --save-config=true -f -
# Pipeline
oc process -f openshift/templates/jenkins/generic-pipeline.yaml --param-file=pipeline.{INSTANCE IDENTITY}.env | oc create --save-config=true -f -
```
