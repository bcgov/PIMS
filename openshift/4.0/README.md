# OpenShift 4.0 Setup

[Portal](https://console.apps.silver.devops.gov.bc.ca/k8s/cluster/projects)

## Projects

| Name  | Namespace                                                                                | Description                                              |
| ----- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| TOOLS | [354028](https://console.apps.silver.devops.gov.bc.ca/k8s/cluster/projects/354028-tools) | DevOps tools for CI/CD, and monitoring.                  |
| DEV   | [354028](https://console.apps.silver.devops.gov.bc.ca/k8s/cluster/projects/354028-dev)   | Initial developer testing and quality assurance.         |
| TEST  | [354028](https://console.apps.silver.devops.gov.bc.ca/k8s/cluster/projects/354028-test)  | User acceptance testing and confirmation before release. |
| PROD  | [354028](https://console.apps.silver.devops.gov.bc.ca/k8s/cluster/projects/354028-prod)  | Production environment to support the client.            |

## Helpful Documentation

- [Issues](https://github.com/BCDevOps/OpenShift4-Migration/issues?page=2&q=is%3Aissue+is%3Aopen)
- [Kubernetes Objects](https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/)
- Using the following command `oc explain pod.spec`
- [Deployment and DeploymentConfig Objects](https://docs.openshift.com/container-platform/4.5/applications/deployments/what-deployments-are.html)
- [Custom Network Security Policy Development](https://developer.gov.bc.ca/Custom-Network-Security-Policy-Development)
- [Docker & Artifactory Implementation Details](https://github.com/BCDevOps/OpenShift4-Migration/issues/51)
- [Artifact Respositories](https://developer.gov.bc.ca/Artifact-Repositories)
- [OpenShift Project Tools](https://github.com/BCDevOps/openshift-developer-tools)
- [S2I Docker Push](https://github.com/BCDevOps/s2i-nginx-npm/blob/6021e7acbcbbd9fca630d65500b3d908aa95cd77/README.md)
- [Push Image](https://cookbook.openshift.org/image-registry-and-image-streams/how-do-i-push-an-image-to-the-internal-image-registry.html)

When using template parameters you can use the following syntax to control the output.

- String Parameter: `${PARAM_NAME}` = `"value"`
- Numeric Parameter: `${{PARAM_NAME}}` = `value`

## Setup Project Namespace or Environment

Login to the OpenShift portal to get a token.

```bash
oc login --token={your token} --server=https://api.silver.devops.gov.bc.ca:6443
```

Make sure you are in the appropriate project namespace when running commands for setup and configuration.

View available projects and identify which is active.

```bash
oc get projects
```

To select the appropriate project to be the active one.

```bash
oc project 354028-dev
```

### Network Security Policy

Each project namespace is by default a [Zero Trust Security Model](https://developer.gov.bc.ca/Platform-Services-Security/Developer-Guide-to-Zero-Trust-Security-Model-on-the-Platform).

Configure each project namespace with the appropriate Network Security Policy (NSP) to enable appropriate communication between projects, pods, internal k8s cluster api and the internet.

To simplify NSP **label** your **DeploymentConfig** objects with `app`, `role` and `env` (or any other appropriate label to identify them).

```yaml
- kind: DeploymentConfig
  apiVersion: v1
  metadata:
    name: pims-web-dc
    labels:
      app: pims
      role: web
      env: prod
    annotations:
      description: How to deploy the pims web application pod.
  spec:
    strategy:
  ...
```

Go to - `/pims/openshift/4.0/templates/network-security-policy`

Configure the TOOLS project namespace.

```bash
oc process -f nsp-tools.yaml | oc create --save-config=true -f -
```

Create a configuration file for each environment `nsp.dev.env`, `nsp.test.env`, `nsp.prod.env`.
Configure each file appropriately for each environment.

**Example**

```conf
ENV_NAME=dev
```

Configure each environment project namespace (DEV, TEST, PROD).

```bash
oc process -f nsp.yaml --param-file=nsp.dev.env | oc create --save-config=true -f -
oc process -f nsp.yaml --param-file=nsp.test.env | oc create --save-config=true -f -
oc process -f nsp.yaml --param-file=nsp.prod.env | oc create --save-config=true -f -
```

If at any time an update needs to be made to the NSP, update the templates and run the `apply` command.

Enable the **Service Account** to pull images from external sources.

```bash
oc project 354028-dev
oc policy add-role-to-user system:image-puller system:serviceaccount:$(oc project --short):default -n 354028-tools

oc project 354028-test
oc policy add-role-to-user system:image-puller system:serviceaccount:$(oc project --short):default -n 354028-tools

oc project 354028-prod
oc policy add-role-to-user system:image-puller system:serviceaccount:$(oc project --short):default -n 354028-tools
```

**Example**

```bash
oc process -f {template file name} --param-file={parameter file name} | oc apply -f -
```

Also remember to delete any NSP that are no longer relevant.

**Example**

```bash
oc delete nsp {name}
```

### Import Images

For the tech stack chosen for PIMS, we need to import the following base images into our OpenShift **tools** namespace:

- NET Core 3.1 SDK and Runtime
- Microsoft SQL Server 2019

Go to - `/pims/openshift/4.0/templates/base-images`

```bash
oc project 354028-tools

oc process -f dotnet-31.yaml | oc create -f -

oc process -f mssql-2019.yaml | oc create -f -
```

### S2I Images

PIMS uses a custom **Source-to-Image (S2I)** Nginx image that requires you to build and push to the Image Repository.

Go to - `/openshift/s2i/nginx-runtime`

Create an image stream for this image.

```bash
oc process -f nginx-runtime.yaml | oc create -f -
```

Build and tag the image.

```bash
docker build -t nginx-runtime .
docker tag nginx-runtime image-registry.apps.silver.devops.gov.bc.ca/354028-tools/nginx-runtime
```

Login to OpenShift with docker and push the image to the Image Repository.

```bash
docker login -u $(oc whoami) -p $(oc whoami -t) image-registry.apps.silver.devops.gov.bc.ca
# Or apparently you can run this command.
oc registry login

docker push image-registry.apps.silver.devops.gov.bc.ca/354028-tools/nginx-runtime
```

#### Apply changes to existing base images

If you make changes to the base images, you will need to push the updates to OpenShift. For this, use **oc replace** instead of oc create.

```bash
oc project 354028-tools

oc process -f dotnet-31.yaml | oc replace -f -

oc process -f msssql-2019.yaml | oc replace -f -
```

### Configure Storage

The PIMS database requires persistent storage. Within OpenShift you will need to create a Persistent Volume Claim (PVC). There are two primary classes of storage, `file` and `block`. Presently the recommendation is to use `netapp-file-standard`.
If you choose `file` you can select the **Access Mode** to be `Shared Access (RWX)`, however if you choose `block` you must select `Singel User (RWO)`.
The data requirements for PIMS is fairly minimum presently, the size can be less than or equal to 3GB.

Go to - `/pims/openshift/4.0/templates/persistent-volume-claims`

Create a configuration file here - `dev.env`

View required and/or available parameters.

```bash
oc process --parameters -f db-storage.yaml
```

Update the configuration file and set the appropriate parameters.

**Example**

```conf
ENV_NAME=dev
```

Review the generated template with the applied parameters.

```bash
oc process -f pims-db-storage.yaml --param-file=dev.env
```

Create the persistent volume claim and save the template.

```bash
oc project 354028-dev

oc process -f pims-db-storage.yaml --param-file=dev.env | oc create --save-config=true -f -
```

### Configure Database

The PIMS database is a MS SQL Server linux container.

Go to - `/pims/openshift/4.0/templates/database`

Create a build configuration file here - `build.dev.env`
Update the configuration file and set the appropriate parameters.

**Example**

```conf
GIT_REF=dev
CONTEXT_DIR=database/mssql
OUTPUT_IMAGE_TAG=latest
CPU_LIMIT=2
MEMORY_LIMIT=6Gi
```

Create the database build and save the template.

```bash
oc project 354028-tools

oc process -f mssql-build.yaml --param-file=build.dev.env | oc create --save-config=true -f -
```

Create a deployment configuration file here - `deploy.dev.env`
Update the configuration file and set the appropriate parameters.

**Example**

```conf
ENV_NAME=dev
IMAGE_TAG=latest
MSSQL_PID=Developer
DB_NAME=pims
DB_USER=admin
PVC_NAME=pims-db-file-storage
CPU_REQUEST=100m
CPU_LIMIT=2c
MEMORY_REQUEST=500MiB
MEMORY_LIMIT=4GiB
```

Create the database deploy and save the template.

```bash
oc process -f mssql-deploy.yaml --param-file=deploy.dev.env | oc create --save-config=true -f -
```

### Configure Elasticsearch

Go to - `/pims/openshift/4.0/templates/logging`

Create a deployment configuration file here - `deploy-elasticsearch.env`
Update the configuration file and set the appropriate parameters.

**Example**

```conf
ELASTICSEARCH_DOMAIN=pims-elastic.apps.silver.devops.gov.bc.ca
ELASTIC_PASSWORD={SECRET}
```

Create the api build and save the template.

```bash
oc project 354028-tools

oc process -f deploy-elasticsearch.yaml --param-file=deploy.elasticsearch.env | oc create --save-config=true -f -
```

Once the pod is up you can test by going to the url [pims-elastic.apps.silver.devops.gov.bc.ca](https://pims-elastic.apps.silver.devops.gov.bc.ca) and entering the username `elastic` and password you configured.

### Configure Kibana

Go to - `/pims/openshift/4.0/templates/logging`

Create a deployment configuration file here - `deploy-kibana.env`
Update the configuration file and set the appropriate parameters.

**Example**

```conf
ELASTICSEARCH_NAME=elasticsearch
KIBANA_DOMAIN=pims-kibana.apps.silver.devops.gov.bc.ca
```

Create the api build and save the template.

```bash
oc project 354028-tools

oc process -f deploy-kibana.yaml --param-file=deploy.kibana.env | oc create --save-config=true -f -
```

Once the pod is up you can test by going to the url [pims-kibana.apps.silver.devops.gov.bc.ca](https://pims-kibana.apps.silver.devops.gov.bc.ca) and entering the username `elastic` and password you configured for elasticsearch.

### Configure API

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
APP_DOMAIN=pims-dev.app.developer.gov.bc.ca
APP_PORT=8080
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://*:8080
CONNECTION_STRINGS_PIMS={Connection String}
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

Create a deployment configuration file here - `deploy-swagger.dev.env`
Update the configuration file and set the appropriate parameters.

The reason this is a separate configuration is because the order routes are created is important, but you can't control the order within a single template.
If a route has the same domain name, but the path is different, then you need to be careful what order you create the routes.

**Example**

```conf
ENV_NAME=dev
APP_DOMAIN=pims-dev.apps.silver.devops.gov.bc.ca
APP_PORT=8080
```

Create the swagger route deployment and save the template.

```bash
oc process -f deploy-swagger.yaml --param-file=deploy-swagger.dev.env | oc create --save-config=true -f -
```

### Configure Web Application

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

### Configure Proxy Caddy

The proxy caddy provides a way to redirec traffic temporarily during a maintenance period.
This container is an S2I provided by the BC DevOps team - [https://github.com/BCDevOps/s2i-caddy](https://github.com/BCDevOps/s2i-caddy).
An example caddy configuration [here](https://gist.github.com/jleach/9b1f9e1fa7083feae8132b004d06aa98).

> Unable to get the S2I proxy caddy to work.

Go to - `/pims/openshift/s2i/bcgov-s2i-caddy`

```bash
oc process -f bcgov-s2i-caddy.yaml | oc create -f -
```

Clone the BC Gov repo and build and tag the image.

```bash
docker build -t bcgov-s2i-caddy .
docker tag bcgov-s2i-caddy image-registry.apps.silver.devops.gov.bc.ca/354028-tools/bcgov-s2i-caddy
```

Login to OpenShift with docker and push the image to the Image Repository.

```bash
docker login -u $(oc whoami) -p $(oc whoami -t) image-registry.apps.silver.devops.gov.bc.ca
# Or apparently you can run this command somehow # oc registry login

docker push image-registry.apps.silver.devops.gov.bc.ca/354028-tools/bcgov-s2i-caddy
```

> Also attempted to pull latest image from DockerHub [caddy](https://hub.docker.com/_/caddy)

The following gets an image from DockerHub and pushes it to our image registry.

```bash
docker pull caddy
docker tag caddy image-registry.apps.silver.devops.gov.bc.ca/354028-tools/caddy
docker push image-registry.apps.silver.devops.gov.bc.ca/354028-tools/caddy
```

> The following doesn't currently work as the caddy image isn't compatible with our configuration.

Go to - `/pims/openshift/4.0/templates/maintenance`

Create a build configuration file here - `build-proxy-caddy.dev.env`
Update the configuration file and set the appropriate parameters.

**Example**

```conf
GIT_REPO=https://github.com/bcgov/pims.git
GIT_REF=dev
IMG_SRC_NAMESPACE=354028-tools
IMG_SRC=bcgov-s2i-caddy
```

Create the api build and save the template.

```bash
oc project 354028-tools

oc process -f build-proxy-caddy.yaml --param-file=build-proxy-caddy.dev.env | oc create --save-config=true -f -
```

You may need to manually run the build config.

```bash
oc start-build proxy-caddy
```

Create a deployment configuration file here - `deploy-proxy-caddy.dev.env`
Update the configuration file and set the appropriate parameters.

**Example**

```conf
PROJECT_NAMESPACE=354028
ROLE_NAME=proxy
ENV_NAME=dev
APP_DOMAIN=proxy-caddy-pims-dev.apps.silver.devops.gov.bc.ca
APP_PORT=2015
```

Create the api deployment and save the template.

```bash
oc process -f deploy-proxy-caddy.yaml --param-file=deploy-proxy-caddy.dev.env | oc create --save-config=true -f -
```

### Configure Database Backup

Provides cron based MSSQL backups using plugin developed for [https://github.com/BCDevOps/backup-container])https://github.com/BCDevOps/backup-container).

See documentation for that project for complete usage documentation, details on the MSSQL plugin, and all source. The container will automatically backup based on the cron scheduled in the config map. Backups may also be taken manually via backup.sh. Usage is provided in the backup-container repo or via `./backup.sh -h`.

Expected usage within PIMS is primarily to use the cron daily backups. This allows us to restore the database in the event of catastrophic failure or corruption with minimal data loss.

> Database backup does not currently work.

Go to - `/pims/openshift/4.0/templates/backup`

Create a configuration map for the backup.

```bash
oc project 354028-dev
oc create -f deploy-config.yaml
```

Create a build configuration file here - `build.dev.env`
Update the configuration file and set the appropriate parameters.

**Example**

```conf
NAME=mssql
GIT_URL=https://github.com/BCDevOps/backup-container.git
GIT_REF=master
CONTEXT_DIR=/docker
DOCKER_FILE_PATH=Dockerfile_MSSQL
OUTPUT_IMAGE_TAG=latest
```

Create the build and save the template.

```bash
oc project 354028-tools
oc process -f build.yaml --param-file=build.dev.env | oc create --save-config=true -f -
```

Create a deployment configuration file here - `deploy.dev.env`
Update the configuration file and set the appropriate parameters.

**Example**

```conf
APP_NAME=pims
ROLE_NAME=backup
ENV_NAME=dev
PROJECT_NAMESPACE=354028
IMAGE_NAMESPACE=354028-tools
IMAGE_NAME=backup-mssql
IMAGE_TAG=dev
DATABASE_SERVICE_NAME=pims-database-dev
DATABASE_NAME=pims
MONGODB_AUTHENTICATION_DATABASE=
DATABASE_DEPLOYMENT_NAME=pims-database-dev-secret
DATABASE_USER_KEY_NAME=DB_USER
DATABASE_PASSWORD_KEY_NAME=DB_PASSWORD
TABLE_SCHEMA=public
BACKUP_STRATEGY=rolling
FTP_SECRET_KEY=ftp-secret
FTP_URL=
FTP_USER=
FTP_PASSWORD=
WEBHOOK_URL=
ENVIRONMENT_FRIENDLY_NAME=
ENVIRONMENT_NAME=
BACKUP_DIR=/backups/
NUM_BACKUPS=
DAILY_BACKUPS=
WEEKLY_BACKUPS=
MONTHLY_BACKUPS=
BACKUP_PERIOD=
CONFIG_FILE_NAME=backup.conf
CONFIG_MAP_NAME=backup-conf
CONFIG_MOUNT_PATH=/
BACKUP_VOLUME_NAME=pims-database-backup
BACKUP_VOLUME_SIZE=5Gi
BACKUP_VOLUME_CLASS=netapp-file-standard
VERIFICATION_VOLUME_NAME=backup-verification
VERIFICATION_VOLUME_SIZE=1Gi
VERIFICATION_VOLUME_CLASS=netapp-file-standard
VERIFICATION_VOLUME_MOUNT_PATH=/var/opt/mssql/data
CPU_REQUEST=100m
CPU_LIMIT=1
MEMORY_REQUEST=256Mi
MEMORY_LIMIT=1Gi
```

Create the deployment and save the template.

```bash
oc process -f deploy-proxy-caddy.yaml --param-file=deploy-proxy-caddy.dev.env | oc create --save-config=true -f -
```

Ensure that the deployment config for `pims-database-${environment}` contains a volume mapping for the backup volume. This will need to be added after the backup volume has been created for the first time in the target environment. There is a commented out section in mssql-deploy with this configuration, or you can complete this task in the GUI by mapping the backup volume to path `/backups`.

Tag the latest `mssql-backup` image for the appropriate environment (i.e. `dev`).
This will trigger the deployment configuration to deploy the pod.

```bash
oc tag mssql-backup:latest mssql-backup:dev
```
