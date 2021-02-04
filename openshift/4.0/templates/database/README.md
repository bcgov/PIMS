# PIMS API Database

The PIMS database is a MS SQL Server linux container.

Go to - `/pims/openshift/4.0/templates/database`

## Build Configuration

Create a build configuration file here - `build.dev.env`
Update the configuration file and set the appropriate parameters.
For the **TEST** and **PROD** environments you should change `GIT_REF=master` and `OUTPUT_IMAGE_TAG={test|prod}`.

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

## Deploy Configuration

Create a deployment configuration file here - `deploy.dev.env`
Update the configuration file and set the appropriate parameters.
For the **TEST** and **PROD** environments you should change `IMAGE_TAG={test|prod}`.
For **PROD** environment you should change `STORAGE_CLASS_NAME=netapp-file-backup`.

**Example**

```conf
ENV_NAME=dev
IMAGE_TAG=latest
MSSQL_PID=Developer
DB_NAME=pims
DB_USER=admin
STORAGE_CLASS_NAME=netapp-file-standard
ACCESS_MODE=ReadWriteMany
VOLUME_CAPACITY=5Gi
CPU_REQUEST=100m
CPU_LIMIT=2c
MEMORY_REQUEST=500MiB
MEMORY_LIMIT=4GiB
```

Create the database deploy and save the template.

```bash
oc process -f mssql-deploy.yaml --param-file=deploy.dev.env | oc create --save-config=true -f -
```
