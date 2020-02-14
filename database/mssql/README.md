# MSSQL DB

If you want to use a MSSQL DB change the _database_ service in the _docker-compose.yml_ file with the following;

```yaml
database:
  restart: always
  container_name: starter_db
  build:
    context: database/mssql
  env_file:
    - database/.env
  ports:
    - "1433:1433"
  volumes:
    - database-data:/var/opt/mssql
  networks:
    - starter_kit
```

## Setup

To get the database running and initialized do the following;

- Create a `.env` file in the `/database` folder
- Populate it with the following environment variables;

```conf
ACCEPT_EULA=Y
MSSQL_SA_PASSWORD=<password>
MSSQL_PID=Developer
```

Enter the `password` you want to secure the DB with. This password needs to be complex enough to match the requirements from Microsoft.

## Connection

To connect manually to the database. Get the docker container Id.

`docker ps`

Copy the docker container Id for the database and past it into the next command.

`docker exec -it e69e056c702d "bash"`

Once inside the container, connect locally with sqlcmd. Note that sqlcmd is not in the path by default, so you have to specify the full path.

`/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P '<password>'`

## Related Information

Configuration - https://docs.microsoft.com/en-us/sql/linux/sql-server-linux-configure-docker?view=sql-server-ver15
