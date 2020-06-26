#!/bin/bash
#
source "$(dirname ${0})/common.sh"

#%
#% OpenShift Deploy Helper
#%
#%   This command starts a new deployment for the provided target deployment
#%   Targets deployments incl.: 'api', 'app-base' and 'app'
#%
#% Usage:
#%
#%   [RELEASE_TAG=<>] [TARGET_TAG=<>] ${THIS_FILE} [DEPLOY_NAME] [apply]
#%
#% Examples:
#%
#%   Provide a target deployment. Defaults to a dry-run.
#%   ${THIS_FILE} api
#%
#%   Apply when satisfied.
#%   ${THIS_FILE} api apply
#%
#%   Set variables to non-defaults at runtime.  E.g. to deploy from TEST to PROD:
#%   RELEASE_TAG=test TARGET_TAG=prod ${THIS_FILE} <...>

# Receive parameters (source and destination)
#
RELEASE_TAG=${RELEASE_TAG:-latest}
TARGET_TAG="${TARGET_TAG:-${TAG_DEV}}"
PROJ_TARGET="${PROJ_PREFIX}-${TARGET_TAG}"
SHORTNAME=${1:-}

# E.g. <deploymentname>-prod
#
IMG_DEST="${APP_NAME}-${SHORTNAME}"
DEPLOYMENT_NAME="${APP_NAME}-${SHORTNAME}-${TARGET_TAG}"

# Trigger the deployment manually when both tags reference the same image hash - retagging won't trigger a deployment
#
HASH_SOURCE="$(oc -n ${PROJ_TOOLS} get istag ${IMG_DEST}:${RELEASE_TAG} -o jsonpath='{.image.dockerImageReference}')"
HASH_TARGET="$(oc -n ${PROJ_TOOLS} get istag ${IMG_DEST}:${TARGET_TAG} -o jsonpath='{.image.dockerImageReference}')"
MANUAL_DEPLOY=$([ "${HASH_SOURCE:-}" != "${HASH_TARGET:-}" ] || echo true)

# Cancel all previous deployments
#
OC_CANCEL_ALL_PREV_DEPLOY="oc -n ${PROJ_TARGET} rollout cancel dc/${DEPLOYMENT_NAME} || true"

# Deploy and follow the progress
#
OC_IMG_RETAG="oc -n ${PROJ_TOOLS} tag ${IMG_DEST}:${RELEASE_TAG} ${IMG_DEST}:${TARGET_TAG}"
OC_DEPLOY="oc -n ${PROJ_TARGET} rollout latest dc/${DEPLOYMENT_NAME}"
[ "${MANUAL_DEPLOY}" ] || OC_DEPLOY=""
OC_STATUS="oc -n ${PROJ_TARGET} rollout status dc/${DEPLOYMENT_NAME} --watch"

if [ "${APPLY}" ]; then
  echo "canceling previous deployments..."
  eval "${OC_CANCEL_ALL_PREV_DEPLOY}"
  count=1
  timeout=10
  # Check previous deployment statuses before moving onto new deploying
  while [ $count -le $timeout ]; do
    sleep 1
    PENDINGS="$(oc -n ${PROJ_TARGET} rollout history dc/${DEPLOYMENT_NAME} | awk '{print $2}' | grep -c Pending || true)"
    RUNNINGS="$(oc -n ${PROJ_TARGET} rollout history dc/${DEPLOYMENT_NAME} | awk '{print $2}' | grep -c Running || true)"
    if [ "${PENDINGS}" == 0 ] && [ "${RUNNINGS}" == 0 ]; then
      # No pending or running replica controllers so exit the while loop
      break 2
    fi
    count=$(( $count + 1 ))
  done
  if [ $count -gt $timeout ]; then
    echo "\n*** Reached the timeout for canceling previous deployments ***\n"
    exit 1
  fi

  # Execute commands
  #
  eval "${OC_IMG_RETAG}"
  eval "${OC_DEPLOY}"
  eval "${OC_STATUS}"
fi

# Provide oc command instructions
#
display_helper $OC_CANCEL_ALL_PREV_DEPLOY $OC_IMG_RETAG $OC_DEPLOY $OC_STATUS
