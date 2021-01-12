#!/bin/bash
#
source "$(dirname ${0})/common.sh"

#%
#% OpenShift Database Helper
#%
#%   Synchronizes the database state with the current set of models and migrations.
#%   Targets incl.: 'dev', 'test' and 'prod'
#%
#% Usage:
#%
#%   [MIGRATION_IMAGE=<>] [MIGRATION_TAG=<>] [DB_CONNECTION_STRING=<>] [DB_PASSWORD=<>] ${THIS_FILE} [TARGET] [-apply]
#%
#% Examples:
#%
#%   Provide a target environment ('dev' OR 'test' OR 'prod'). Defaults to a dry-run.
#%   ${THIS_FILE} dev
#%
#%   Apply when satisfied.
#%   ${THIS_FILE} dev -apply
#%
#%   Set variables to non-defaults at runtime.  E.g. to migrate the PROD database:
#%   MIGRATION_TAG=master DB_PASSWORD=<> DB_CONNECTION_STRING=<> ${THIS_FILE} prod -apply

# Target project override for Dev, Test or Prod deployments
#
PROJ_TARGET="${PROJ_TARGET:-${PROJ_PREFIX}-${TARGET}}"

# Parameters and mode variables
#
[ "${DB_PASSWORD:-}" ] || {
  fatal_error "DB_PASSWORD environment value must be set"
}
[ "${DB_CONNECTION_STRING:-}" ] || {
  fatal_error "DB_CONNECTION_STRING environment value must be set"
}
ASPNETCORE_ENVIRONMENT=${ASPNETCORE_ENVIRONMENT:-Production}
MIGRATION_IMAGE=${MIGRATION_IMAGE:-pims-migrations}
MIGRATION_TAG=${MIGRATION_TAG:-dev}
COMMAND=${COMMAND:-}

FULL_IMAGE="docker-registry.default.svc:5000/${PROJ_TOOLS}/${MIGRATION_IMAGE}:${MIGRATION_TAG}"

# Rebuild migrations image - e.g. 'pims-migrations-dev' OR 'pims-migrations-master'
#
BUILD_NAME="${BUILD_NAME:-${MIGRATION_IMAGE}-${MIGRATION_TAG}}"
start_build "${BUILD_NAME}"

# Run database migrations
#
OC_MIGRATE="oc run migration-job \
  -n ${PROJ_TARGET} \
  --image=${FULL_IMAGE} \
  --image-pull-policy=Always \
  --attach \
  --rm \
  --restart=Never \
  --env='ASPNETCORE_ENVIRONMENT=${ASPNETCORE_ENVIRONMENT}' \
  --env='ConnectionStrings__PIMS=${DB_CONNECTION_STRING}' \
  --env='DB_PASSWORD=${DB_PASSWORD}' \
  --limits='cpu=1000m,memory=1Gi' \
  --requests='cpu=500m,memory=512Mi'"
[ "${COMMAND}" ] && OC_MIGRATE="${OC_MIGRATE} --command -- ${COMMAND}"

# Execute commands
#
if [ "${APPLY}" ]; then
  echo -e "\n[+] Migration Job started\n"
  eval "${OC_MIGRATE}"
fi

# Provide oc command instruction
#
display_helper "${OC_MIGRATE}"
