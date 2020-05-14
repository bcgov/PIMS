#!/bin/bash

# Start SQL Server
echo "Start MS SQL Server and run scripts"

if ! whoami &> /dev/null; then
  if [ -w /etc/passwd ]; then
    echo "${USER_NAME:-sqlservr}:x:$(id -u):0:${USER_NAME:-sqlservr} user:${HOME}:/sbin/nologin" >> /etc/passwd
  fi
fi
# exec "$@"

/usr/config/setup.sh & /opt/mssql/bin/sqlservr
