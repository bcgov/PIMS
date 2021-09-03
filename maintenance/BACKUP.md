# Backup/Restore Database

The Backup container currently automates a scheduled backup of the database.
More information here [https://github.com/BCDevOps/backup-container](https://github.com/BCDevOps/backup-container).

## Backup Manually

To manually backup the database follow these steps.

1) Using your browser open the database backup pod and view the **Terminal** tab.  Or you can remote into the pod with `oc rsh [pod name]`.
2) Enter the following in the terminal to create a backup.

```bash
./backup.sh -1
```

## Restore Manually

To manually restore a specific database follow these steps.

1) Using your browser open the database backup pod and view the **Terminal** tab.
2) Enter the following in the terminal to restore the specific backup.

```bash
./backup.sh -r mssql=pims-database:1433/pims -f /backups/daily/2021-09-02/pims-database-pims_2021-09-02_12-43-36
```

## Copy Backup Locally

To copy a backup locally use the `oc rsync` command.
On Windows you will need to install this dependency, which can be done with Chocolately.

- Install [Chocolately](https://chocolatey.org/install)
- Install **cwRsync** should be done with `choco install rsync`
- If you run into issue with Chocolately you might be able to manually install **cwRsync**.  Download [here](https://www.rsync.net/resources/binaries/cwRsync_5.4.1_x86_Free.zip).  Copy the `sync.exe` to `C:/ProgramData/chocolately/bin`.

### Copy Files

To copy the backup files from the remote backup pod follow these steps.

1) Login to the OpenShift website and copy the login command.
2) Paste the login command in your `bash` terminal.
3) Enter the following in your `bash` terminal.  If you run into issues downloading related to EOF, try creating another backup and then trying again.  This may work better with WSL.

```bash
oc project 354028-prod
oc get pods
# Copy the backup pod name and place it into the cmd below.
oc rsync pims-backup-3-4wwk6:/backups/daily/2021-09-02 ./backups
```

Now copy the local files up to the destination backup pod.

```bash
oc project 354028-test
oc get pods
# Copy the backup pod name and place it into the cmd below.
oc rsync ./backups/2021-09-02 pims-backup-3-4wwk6:/backups/daily/2021-09-02
```

