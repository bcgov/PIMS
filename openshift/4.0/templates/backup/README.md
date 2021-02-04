# Database Backup Service

Provides cron based MSSQL backups using plugin developed for [https://github.com/BCDevOps/backup-container](https://github.com/BCDevOps/backup-container).

See documentation for that project for complete usage documentation, details on the MSSQL plugin, and all source. The container will automatically backup based on the cron scheduled in the config map. Backups may also be taken manually via backup.sh. Usage is provided in the backup-container repo or via `./backup.sh -h`.

Expected usage within PIMS is primarily to use the cron daily backups. This allows us to restore the database in the event of catastrophic failure or corruption with minimal data loss.

> We do not presently monitor whether this cronjob fails. This is a high risk area that should be addressed.

## Example ConfigMap

```
# ============================================================
# Databases:
# ------------------------------------------------------------
# List the databases you want backed up here.
# Databases will be backed up in the order they are listed.
#
# The entries must be in one of the following forms:
# - <Hostname/>/<DatabaseName/>
# - <Hostname/>:<Port/>/<DatabaseName/>
# - <DatabaseType>=<Hostname/>/<DatabaseName/>
# - <DatabaseType>=<Hostname/>:<Port/>/<DatabaseName/>
# <DatabaseType> can be postgres, mongo or mssql
# <DatabaseType> MUST be specified when you are sharing a
# single backup.conf file between postgres, mongo and mssql
# backup containers.  If you do not specify <DatabaseType>
# the listed databases are assumed to be valid for the
# backup container in which the configuration is mounted.
#
# Examples:
# - postgres=postgresql/my_database
# - postgres=postgresql:5432/my_database
# - mongo=mongodb/my_database
# - mongo=mongodb:27017/my_database
# - mssql=mssql_server:1433/my_database
# -----------------------------------------------------------
# Cron Scheduling:
# -----------------------------------------------------------
# List your backup and verification schedule(s) here as well.
# The schedule(s) must be listed as cron tabs that
# execute the script in 'scheduled' mode:
#   - ./backup.sh -s
#
# Examples (assuming system's TZ is set to PST):
# - 0 1 * * * default ./backup.sh -s
#   - Run a backup at 1am Pacific every day.
#
# - 0 4 * * * default ./backup.sh -s -v all
#   - Verify the most recent backups for all datbases
#     at 4am Pacific every day.
# -----------------------------------------------------------
# Full Example:
# -----------------------------------------------------------
# postgres=postgresql:5432/TheOrgBook_Database
# mongo=mender-mongodb:27017/useradm
# postgres=wallet-db/tob_issuer
# mssql=pims-database:1433/pims
#
# 0 1 * * * default ./backup.sh -s
# 0 4 * * * default ./backup.sh -s -v all
# ============================================================
0 1 * * * default ./backup.sh -s
mssql=pims-database:1433/pims
```

## Build Configuration

Go to - `/pims/openshift/4.0/templates/backup`

You may need to update the configuration template **ConfigMap** to reflect your backup schedule and database service name, port and database name.

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

## Deploy Configuration

Create a deployment configuration file here - `deploy.dev.env`
Update the configuration file and set the appropriate parameters.
For the **TEST** and **PROD** environments you should change `ENV_NAME={test|prod}`.

**Example**

```conf
ENV_NAME=test
IMAGE_NAME=backup-mssql
IMAGE_TAG=dev

DATABASE_ROLE_NAME=database
DATABASE_NAME=pims
DATABASE_USER_KEY_NAME=DB_USER
DATABASE_PASSWORD_KEY_NAME=DB_PASSWORD
TABLE_SCHEMA=public
BACKUP_STRATEGY=rolling
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
CONFIG_MOUNT_PATH=/

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
oc project 354028-dev
oc process -f deploy.yaml --param-file=deploy.dev.env | oc create --save-config=true -f -
```

## OpenShift CronJobs

OpenShift 4.0 supports cronjobs natively.
This would allow removing the dependency of the backup pod cronjob and simply running it with a native cronjob.
This would also decrease resources required to support PIMS.

> Presently we do not know how to set this up.
