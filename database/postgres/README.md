# PostgreSQL DB

If you want to use a PostgreSQL DB change the _database_ service in the _docker-compose.yml_ file with the following;

```yaml
database:
  restart: always
  container_name: starter_db
  build:
    context: database/postgres
  env_file:
    - database/.env
  ports:
    - "5433:5432"
  volumes:
    - database-data:/var/lib/postgresql/data
  networks:
    - starter_kit
```

## Setup

To get the database running and initialized do the following;

- Create a `.env` file in the `/database` folder
- Populate it with the following environment variables;

```conf
POSTGRES_USER=<username>
POSTGRES_PASSWORD=<password>
POSTGRES_DB=<database name>
```

Enter the `username` you want to initialize the DB with.
Enter the `password` you want to secure the DB with.
Enter the `database name` you want to initialize the DB with.

## Connection

To connect manually to the database.

```bash
npm install -g psql
psql -h localhost -p 54320 -U john -d mydb
```
