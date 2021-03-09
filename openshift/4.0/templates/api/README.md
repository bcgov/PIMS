# PIMS .NET Core API

Configure **two** build configurations; one for DEV builds and one for PROD builds. The development build should target the **`dev`** branch in GitHub, while the production build should target the **`master`** branch. Make sure you have `.env` files setup for each configuration.

Go to - `/pims/openshift/4.0/templates/api`

Create a build configuration file here - `build.dev.env`
Update the configuration file and set the appropriate parameters.

**Example**

```conf
GIT_REF=dev
DOTNET_CONFIGURATION=Release
OUTPUT_IMAGE_TAG=latest
CPU_LIMIT=1
MEMORY_LIMIT=2Gi
```

Create the api build and save the template.

```bash
oc project 354028-tools
oc process -f build.yaml --param-file=build.dev.env | oc create --save-config=true -f -
```

Tag the image so that the appropriate environment can pull the image.

```bash
oc tag pims-api:latest pims-api:dev
```

Create a deployment configuration file here - `deploy.dev.env`
Update the configuration file and set the appropriate parameters.

**Example**

```conf
ENV_NAME=dev
IMAGE_TAG=dev
APP_DOMAIN=pims-dev.apps.silver.devops.gov.bc.ca
APP_PORT=8080
API_PATH=/api
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://*:8080
CONNECTION_STRINGS_PIMS=Server=pims-database,1433;User ID=admin;Database=pims
KEYCLOAK_AUDIENCE=pims-api
KEYCLOAK_AUTHORITY=https://dev.oidc.gov.bc.ca/auth/realms/xz0xtue5
KEYCLOAK_ADMIN_AUTHORITY=https://dev.oidc.gov.bc.ca/auth/admin/realms/xz0xtue5
KEYCLOAK_SECRET={SECRET} # This isn't currently a required value for the api configuration.
KEYCLOAK_SERVICE_ACCOUNT_SECRET={SECRET} # Log into Keycloak and get the pims-service-account secret.
CHES_USERNAME={SECRET} # Make a request to the CHES team for the username.
CHES_PASSWORD={SECRET} # Make a request to the CHES team for the password.
GEOCODER_KEY={SECRET} # Make a request to BC Data Wharehouse for the secret.
ELASTIC_PASSWORD={SECRET} # Look at the secret configured for Elasticsearch.
HEALTH_SCHEME=HTTP
LIVENESS_PATH=/health/live
READINESS_PATH=/health/ready
CPU_REQUEST=100m
CPU_LIMIT=1
MEMORY_REQUEST=500Mi
MEMORY_LIMIT=4Gi
```

Create the api deployment and save the template.

```bash
oc project 354028-dev
oc process -f deploy.yaml --param-file=deploy.dev.env | oc create --save-config=true -f -
```

Create a deployment configuration file here - `deploy-routes.dev.env`
Update the configuration file and set the appropriate parameters.

In **PROD** you will need to get the SSL certificate values and update the `deploy-routes.yaml` file `tls` sections.

```yaml
tls:
  insecureEdgeTerminationPolicy: Redirect
  termination: edge
  caCertificate: "{ENTER YOUR CA CERT HERE}"
  certificate: "{ENTER YOUR CERT HERE}"
  key: "{ENTER YOUR CERT KEY HERE}"
```

> Do not check in your certificate values to git.

**Example**

```conf
ENV_NAME=dev
INSTANCE=
APP_DOMAIN=pims-dev.apps.silver.devops.gov.bc.ca
APP_PORT=8080
API_PATH=/api
```

Create the api deployment and save the template.

```bash
oc process -f deploy-routes.yaml --param-file=deploy-routes.dev.env | oc create --save-config=true -f -
```
