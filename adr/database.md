# Database Choice - MS-SQL

## Status

> Accepted

> January 1, 2020

## Context

PIMS requires a database to store all property information.
The data is relational, requiring constraints and must run within a Linux docker container on OpenShift.
Additionally it must be supported by Entity Framework Core 3.1.

## Decision

Originally the database generated for the SWU was with PostgreSQL, after further consideration it made more sense to tightly couple both MS-SQL with .NET Core.
This will give us better performance and tighter integration with Entity Framework Core.
It was decided to create a Linux docker container to host the MS-SQL 2019 database.

## Consequences

There are benefits from doing it as there is tighter integration with Entity Framework Core.
One such example is simpler optimistic concurrency handling.
It makes it move difficult with additional effort to setup OpenShift, as there are not existing lab projects we can use.
