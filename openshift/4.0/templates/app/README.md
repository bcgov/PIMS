# PIMS React Web Application

Configure **two** build configurations; one for DEV builds and one for PROD builds. The development build should target the **`dev`** branch in GitHub, while the production build should target the **`master`** branch. Make sure you have `.env` files setup for each configuration.

Go to - `/pims/openshift/4.0/templates/app`

Create a build configuration file here - `build.dev.env`
Update the configuration file and set the appropriate parameters.

**Example**

```conf
BUILDIMAGE_NAME=nodejs-10-rhel7
BUILDIMAGE_TAG=1-30
RUNTIMEIMAGE_NAME=nginx-runtime
RUNTIMEIMAGE_TAG=latest
GIT_URL=https://github.com/bcgov/PIMS.git
GIT_REF=dev
SOURCE_CONTEXT_DIR=frontend
OUTPUT_IMAGE_TAG=latest
CPU_LIMIT=1
MEMORY_LIMIT=6Gi
```

Create the api build and save the template.

```bash
oc project 354028-tools
oc process -f build.yaml --param-file=build.dev.env | oc create --save-config=true -f -
```

Tag the image so that the appropriate environment can pull the image.

```bash
oc tag pims-app:latest pims-app:dev
```

Create a deployment configuration file here - `deploy.dev.env`
Update the configuration file and set the appropriate parameters.

**Example**

```conf
ENV_NAME=dev
IMAGE_TAG=dev
APP_DOMAIN=pims-dev.apps.silver.devops.gov.bc.ca
APP_PORT=8080
KEYCLOAK_REALM=xz0xtue5
KEYCLOAK_CONFIG_FILE_NAME=keycloak.json
KEYCLOAK_CONFIG_MOUNT_PATH=/tmp/app/dist/
KEYCLOAK_AUTHORITY_URL=https://dev.oidc.gov.bc.ca/auth
REAL_IP_FROM=172.51.0.0/16
API_PATH=/api
CPU_REQUEST=100m
CPU_LIMIT=1
MEMORY_REQUEST=100Mi
MEMORY_LIMIT=2Gi
```

Create the api deployment and save the template.

```bash
oc project 354028-dev
oc process -f deploy.yaml --param-file=deploy.dev.env | oc create --save-config=true -f -
```

Create a deployment configuration file here for the route - `deploy-routes.dev.env`
Update the configuration file and set the appropriate parameters.

In **PROD** you will need to get the SSL certificate values and update the `deploy-routes.yaml` file `tls` section.

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
APP_DOMAIN=pims-dev.apps.silver.devops.gov.bc.ca
APP_PORT=8080
```

```bash
oc process -f deploy-routes.yaml --param-file=deploy-routes.dev.env | oc create --save-config=true -f -
```
