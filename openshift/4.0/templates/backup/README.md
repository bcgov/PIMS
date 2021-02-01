# Database Backup Service

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
