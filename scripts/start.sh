#!/bin/bash
cd "$(dirname "$0")"
./build.sh
docker-compose up -d
