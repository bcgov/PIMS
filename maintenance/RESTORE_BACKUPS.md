# How to Restore a backup hosted on an external openshift instance

**NOTE: if you are simply trying to restore a backup from the same openshift instance, skip directly to step 4**
**NOTE: if performing a restore on a live instance of PIMS, see maintenance page documentation [here](./README.md)**

0. Optionally, enable the display of the maintenance page if the restore is targeting a live instance of PIMS.
1. login to the openshift environment hosting the DB you wish to copy the backup from.
1. change to the project hosting the desired database using: oc project `\${projectName}`
1. use oc-rsync to copy the desired backup files from the database to a directory on your local machine. ie: `oc rsync pims-db-prod-6-ddck4:/backups/daily/2021-02-18 ./backups`
1. login to the openshift environment hosting the DB where you would like to restore the backup.
1. change to the project hosting the desired database using: oc project `\${projectName}`
1. use oc-rsync to copy the backup files from your local machine to the volume on the backup pod. ie: `oc rsync ./backups pims-database-1-k8hsh:/backups/daily/2021-02-18`
1. login to the terminal on the backup pod and backup the database using ./backup.sh. ie: `./backup.sh -r mssql:pims-database/pims -f pims-db-prod-pims_2021-02-18_01-00-00` **NOTE: you may exclude the -f parameter if restoring a backup from the same openshift instance**
1. confirm the backup script completed normally by validating the sh output.
1. If you enabled the maintenance page in step 0, ensure to disable it and test that traffic is routing normally to the app pod, and that the app is functioning as expected post restore.
