# MSSQL DB

If you want to use a MSSQL DB change the _database_ service in the _docker-compose.yml_ file with the following;

```yaml
database:
  restart: always
  container_name: starter_db
  build:
    context: database/mssql
  env_file:
    - database/mssql/.env
  ports:
    - "1433:1433"
  volumes:
    - database-data:/var/opt/mssql
  networks:
    - starter_kit
```

## MSSQL Environment Variables

To get the database running and initialized do the following;

- Create a `.env` file in the `/database/mssql` folder
- Populate it with the following environment variables;

```conf
ACCEPT_EULA=Y
MSSQL_SA_PASSWORD={password}
MSSQL_PID=Developer
```

| Key               | Value            | Description                                                  |
| ----------------- | ---------------- | ------------------------------------------------------------ |
| ACCEPT_EULA       | [Y\|N]           | Whether you accept the license agreement.                    |
| MSSQL_SA_PASSWORD | {password}       | Enter the `password` you want to secure the DB with. This password needs to be complex enough to match the requirements from Microsoft (see below). |
| MSSQL_PID         | [Developer\|...] | The version of the database to install.                      |

## Password Complexity

As per Microsoft documentation, the `MSSQL_SA_PASSWORD` value must meet the following guidelines:

- The password does not contain the account name of the user.
- The password is at least **eight characters** long.
- The password contains characters from **three** of the following four categories:
  - Uppercase letters (A through Z)
  - Lowercase letters (a through z)
  - Base 10 digits (0 through 9)
  - Non-alphanumeric characters such as: exclamation point (!), dollar sign ($), number sign (#), or percent (%).

Passwords can be up to 128 characters long. Use passwords that are as long and complex as possible.

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

Configuration details [here](https://docs.microsoft.com/en-us/sql/linux/sql-server-linux-configure-docker?view=sql-server-ver15)
