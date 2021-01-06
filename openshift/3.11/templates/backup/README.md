# MS SQL Database Backups

Provides cron based MSSQL backups using plugin developed for https://github.com/BCDevOps/backup-container

See documentation for that project for complete usage documentation, details on the MSSQL plugin, and all source. The container will automatically backup based on the cron scheduled in the config map. Backups may also be taken manually via backup.sh. Usage is provided in the backup-container repo or via `./backup.sh -h`.

Expected usage within PIMS is primarily to use the cron daily backups. This allows us to restore the database in the event of catastrophic failure or corruption with minimal data loss.

Expected namespaces:

- jcxjin-dev
- jcxjin-test
- jcxjin-prod

For the sake of simplicity all examples will use jcxjin-dev.

## Backup Build

1. View the parameters `oc process --parameters -f openshift/templates/backup/build.yaml`
2. Optionally (the defaults will generally be correct) Create a **`build.env`** file that contains the values for the parameters within the template.
3. Create the pipeline objects (add --param-file=[build.env] to oc process if using overrides) `oc process -f openshift/templates/backup/build.yaml | oc create -f -`

## Backup Config Map

1. Add any desired cron configuration and mssql database connections to backup.conf (that file contains examples).
2. Either run `backup-deploy.overrides.sh` from https://github.com/BCDevOps/backup-container/tree/master/openshift which will generate a new deployment config, or manually edit backup-conf-configmap_DeploymentConfig.json
3. Run `oc create -f backup-config-deploy.yaml` or `oc create -f backup-config-deploy.json` to create the deployment config within Openshift.

## Backup Deployment Config

1. View the parameters `oc process --parameters -f openshift/templates/backup/deploy.yaml`
2. Most of the defaults should be correct, so either create a **`deploy.env`** file that contains the values for the parameters within the template, or provide any desired paremeter changes with -p (see below for example).
3. Create the pipeline objects. Note that DATABASE_DEPLOYMENT_NAME should be set to whatever secret holds the pims database credentials. note that the BACKUP_VOLUME_SIZE MUST match the size of your provisioned volume.

```
oc process -f deploy.yaml -n jcxjin-dev \
-p BACKUP_VOLUME_NAME=bk-jcxjin-dev-fakefakefake \
-p IMAGE_TAG=dev \
-p BACKUP_VOLUME_SIZE=3Gi \
-p ENV_NAME=dev \
-p DATABASE_DEPLOYMENT_NAME=pims-db-dev-secret | oc apply -f -
```

4. Note that whilst the deployment config contains all resources required to run, it does require that pims-db-\${namespace}-secret has already been created in the environment. This should be a safe assumption given that the database container should already be created in the target environment.

5. Ensure that the deployment config for pims-db-\${environment} contains a volume mapping for the backup volume. This will need to be added after the backup volume has been created for the first time in the target environment. There is a commented out section in mssql-deploy with this configuration, or you can complete this task in the GUI by mapping the backup volume to path /backups.
