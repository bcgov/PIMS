#!/bin/bash
#
source "$(dirname ${0})/common.sh"

#%
#% OpenShift Database Helper
#%
#%   Intended for use with a pull request-based pipeline.
#%   Targets incl.: 'dev', 'test' and 'prod'
#%   OPTION: c, l, r, v, f, 1, s, p, a, h
#%
#% Usage:
#%
#%   ${THIS_FILE} [TARGET] -[OPTION] [-apply]
#%
#% Examples:
#%
#%   Provide a target environment ('dev' OR 'test' OR 'prod'). Defaults to a dry-run.
#%   ${THIS_FILE} dev
#%
#%   Apply when satisfied.
#%   ${THIS_FILE} dev -apply
#%

# Target project override for Dev, Test or Prod deployments
#
PROJ_TARGET="${PROJ_TARGET:-${PROJ_PREFIX}-${TARGET}}"

# Parameters and mode variables
#
INSTANCE_ID=${INSTANCE_ID:-}

# Take backup of database
#
OC_BACKUP="oc rsh -n ${PROJ_TARGET} dc/pims-backup${INSTANCE_ID} bash -c './backup.sh -1'"

# Execute commands
#
if [ "${APPLY}" ]; then
  eval "${OC_BACKUP}"
fi

# Provide oc command instruction
#
display_helper "${OC_BACKUP}"
