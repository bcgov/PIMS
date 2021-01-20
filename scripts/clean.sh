#!/bin/bash

docker-compose down
docker system prune --all --force
docker volume prune --force
