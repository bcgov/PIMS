# PIMS API Database

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
