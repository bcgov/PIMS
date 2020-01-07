#!/bin/bash

# Build each container
docker-compose build database
docker-compose up -d database
docker-compose build --no-cache --build-arg connectionString="Host=host.docker.internal;Port=5433;Username=postgres;Password=password;Database=geospatial;" backend
docker-compose build frontend
docker-compose build keycloak-db
docker-compose build keycloak
