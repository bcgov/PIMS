# MSSQL DB

If you want to use a MSSQL DB change the _database_ service in the _docker-compose.yml_ file with the following;

```yaml
database:
  restart: on-failure
  container_name: api-db
  build:
    context: database/mssql
  env_file:
    - database/mssql/.env
  ports:
    - "5433:1433"
  volumes:
    - api-db-data:/var/opt/mssql
  networks:
    - pims
```

## MSSQL Environment Variables

To get the database running and initialized do the following;

- Create a `.env` file in the `/database/mssql` folder
- Populate it with the following environment variables;

```conf
ACCEPT_EULA=Y
MSSQL_SA_PASSWORD={password}
MSSQL_PID=Developer
TZ=America/Los_Angeles

DB_NAME=pims
DB_USER=admin
DB_PASSWORD={password}
```

| Key               | Value               | Description                                                                                                                                         |
| ----------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| ACCEPT_EULA       | [Y\|N]              | Whether you accept the license agreement.                                                                                                           |
| MSSQL_SA_PASSWORD | {password}          | Enter the `password` you want to secure the DB with. This password needs to be complex enough to match the requirements from Microsoft (see below). |
| MSSQL_PID         | Developer           | The edition of the database to install [Developer\|Express\|Standard\|Enterprise\|EnterpriseCore].                                                  |
| TZ                | America/Los_Angeles | The timezone to run the database in. Bash into your container and use the command `tzselect` to manually change the timezone.                       |
| DB_NAME           | pims                | The name of the database to create when the pod is deployed.                                                                                        |
| DB_USER           | admin               | The name of the user account that pims will use to connect to the database instead of the 'sa'.                                                     |
| DB_PASSWORD       | {password}          | Enter the `password` you want to secure the DB with. This password needs to be complex enough to match the requirements from Microsoft (see below). |

## Password Complexity

As per Microsoft documentation, the `MSSQL_SA_PASSWORD` value must meet the following guidelines:

- The password does not contain the account name of the user.
- The password is at least **eight characters** long.
- The password contains characters from **three** of the following four categories:
  - Uppercase letters (A through Z)
  - Lowercase letters (a through z)
  - Base 10 digits (0 through 9)
  - Non-alphanumeric characters such as: exclamation point (!), dollar sign (\$), number sign (#), or percent (%).

Passwords can be up to 128 characters long. Use passwords that are as long and complex as possible.

## Create a customized container

If you do create your own Dockerfile, be aware of the foreground process, because this process controls the life of the container. If it exits, the container will shutdown. For example, if you want to run a script and start SQL Server, make sure that the SQL Server process is the right-most command. All other commands are run in the background. The following command illustrates this inside a Dockerfile:

```bash
/usr/src/app/do-my-sql-commands.sh & /opt/mssql/bin/sqlservr
```

## Connection

To connect manually to the database. Get the docker container Id.

```bash
docker ps
```

Copy the docker container Id for the database and past it into the next command.

```bash
docker exec -it e69e056c702d "bash"
```

Once inside the container, connect locally with sqlcmd. Note that sqlcmd is not in the path by default, so you have to specify the full path.

```bash
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P '<password>'
```

## Related Information

- Configuration details [here](https://docs.microsoft.com/en-us/sql/linux/sql-server-linux-configure-docker?view=sql-server-ver15)
- Running Scripts remotely [here](https://portworx.com/run-ha-sql-server-red-hat-openshift/)
-
