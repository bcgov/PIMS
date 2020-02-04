# PostgreSQL DB
If you want to use a PostgreSQL DB change the *database* service in the *docker-compose.yml* file with the following;

```
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
```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=geospatial
```

## Connection

To connect manually to the database.

> `npm install -g psql`

> `psql -h localhost -p 54320 -U john -d mydb`
