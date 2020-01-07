# PostgreSQL DB

## Setup

To get the database running and initialized do the following;

- Create a `.env` file in the `/database` folder
- Populate it with the following environment variables;
```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=geospatial
```

- Go to the `/backend` folder
- > `dotnet restore`
- > `dotnet build`
- > `dotnet ef database update`

## New Migration

To add a new database code migration do the following;

- Go to the /backend folder
- > `dotnet ef migrations add [name]`

## Problems

Windows doesn't support mounting volumes locally. You have to add a `.env` file to the same directory as the `docker-compose.yml` file. Within that file the `COMPOSE_CONVERT_WINDOWS_PATHS=true` setting.

To connect
`npm install -g psql`
`psql -h localhost -p 54320 -U john -d mydb`
