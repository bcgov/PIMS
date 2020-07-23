# Monorepo vs Multirepo

## Status

> Accepted

> January 1, 2020

## Context

Our project involves developing a number of tools and layers to support PIMS.
This includes at present the following;

- Frontend GUI Web Application
- Backend RESTful API
- Frontend GIS components
- Backend database
- Keycloak integration
- OpenShift integration
- Docker integration
- ETL tools

## Decision

The Exchange Lab's practice is to use the monorepo solution.

## Consequences

SonarQube doesn't natively support monorepos with different programming languages.

DevOps is more complicated with a monorepo.

A benefit of the monorepo is that it is easier to maintain and perform rapid iterations.
