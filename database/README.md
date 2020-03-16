# Database

The API requires a database for storing PIMS data. Currently the choice is to use MSSQL for tighter integration with .NET Core Entity Framework.

Refer to documentation for the database type.

- [MSSQL](mssql/README.md)
- [PostgreSQL](postgres/README.md)

## Issues

Windows doesn't support mounting volumes locally. You may have to add a `.env` file to the same directory as the `docker-compose.yml` file. Within that file the `COMPOSE_CONVERT_WINDOWS_PATHS=true` setting.

## Initialize Database

To get the database running and initialized do one of the following;

- Follow the MSSQL steps here - [README](./mssql/README.md)
- Follow the PostgreSQL steps here - [README](./postgres/README.md)

## Remoting into OpenShift Database

When running a database within OpenShift you may need to remote into the database to debug or make changes.

> Refer to the documentation [here](../openshift/README.md#Remote%20into%20Database) for more information.
