#!/bin/bash

# Start the database first so that the backend can initialize it.
# cd "$(dirname "$0")"
./scripts/gen-env-files.sh
./scripts/build.sh

# Start all docker containers.
docker-compose up -d
