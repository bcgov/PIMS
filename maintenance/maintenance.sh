#!/bin/bash


# Halt on errors/unsets, change fail returns, change field separator
#
set -euo pipefail
IFS=$'\n\t'


# Parameters and mode variables
#
PROJECT=jcxjin-${1:-}
COMMAND=${2:-}
VERBOSE=${VERBOSE:-}


# App and build settings
#
APPLICATION_NAME=${APPLICATION_NAME:-pims-app}
INSTANCE_ID=${INSTANCE_ID:-}
ENVIRONMENT_NAME=${1:-}
APPLICATION_PORT=${APPLICATION_PORT:-8080-tcp}
STATIC_PAGE_NAME=${STATIC_PAGE_NAME:-proxy-caddy}
STATIC_PAGE_PORT=${STATIC_PAGE_PORT:-2015-tcp}
STATIC_PAGE_HOSTNAME=${STATIC_PAGE_HOSTNAME:-proxy-caddy-pims-${ENVIRONMENT_NAME}${INSTANCE_ID}.pathfinder.gov.bc.ca}
#
IMG_SRC=${IMG_SRC:-bcgov-s2i-caddy}
GIT_REPO=${GIT_REPO:-https://github.com/bcgov/pims.git}
GIT_BRANCH=${GIT_BRANCH:-dev}
OC_BUILD=${OC_BUILD:-../openshift/templates/maintenance/caddy.bc.yaml}
OC_DEPLOY=${OC_DEPLOY:-../openshift/templates/maintenance/caddy.dc.yaml}
BUILD_PROJECT=${BUILD_PROJECT:-jcxjin-tools}


# Verbose option
#
[ "${VERBOSE}" == true ] && \
  set -x


# Show message if passed any params
#
if [ "${#}" -lt 2 ]
then
  echo
  echo "Maintenace Mode: Caddy served static page"
  echo
  echo "Provide a project and a command."
  echo " './maintenance.sh <project_name> <on|off|build|deploy>'"
  echo
  echo "Set variables to non-defaults at runtime.  E.g.:"
  echo " 'VERBOSE=true GIT_BRANCH=master ./maintenance.sh <...>'"
  echo
  exit
fi


# Check project
#
CHECK=$( oc projects | tr -d '*' | grep -v "Using project" | grep "${PROJECT}" | awk '{ print $1 }' || echo )
if [ "${PROJECT}" != "${CHECK}" ]
then
  echo
  echo "Unable to access project ${PROJECT}"
  echo
  exit
fi


# Action based on parameter
#
if [ "${COMMAND}" == "on" ]
then
  oc patch route "${APPLICATION_NAME}-${ENVIRONMENT_NAME}${INSTANCE_ID}" -n ${PROJECT} -p \
    '{ "spec": { "to": { "name": "'$( echo ${STATIC_PAGE_NAME} )'" },
    "port": { "targetPort": "'$( echo ${STATIC_PAGE_PORT} )'" }}}'
  oc patch route ${STATIC_PAGE_NAME} -n ${PROJECT} -p \
    '{ "spec": { "to": { "name": "'$( echo "${APPLICATION_NAME}-${ENVIRONMENT_NAME}${INSTANCE_ID}" )'" },
    "port": { "targetPort": "'$( echo ${APPLICATION_PORT} )'" }}}'
elif [ "${COMMAND}" == "off" ]
then
  oc patch route "${APPLICATION_NAME}-${ENVIRONMENT_NAME}${INSTANCE_ID}" -n ${PROJECT} -p \
    '{ "spec": { "to": { "name": "'$( echo "${APPLICATION_NAME}-${ENVIRONMENT_NAME}${INSTANCE_ID}" )'" },
    "port": { "targetPort": "'$( echo ${APPLICATION_PORT} )'" }}}'
  oc patch route ${STATIC_PAGE_NAME} -n ${PROJECT} -p \
    '{ "spec": { "to": { "name": "'$( echo ${STATIC_PAGE_NAME} )'" },
    "port": { "targetPort": "'$( echo ${STATIC_PAGE_PORT} )'" }}}'
elif [ "${COMMAND}" == "build" ]
then
  oc process -f ${OC_BUILD} \
    -p NAME=${STATIC_PAGE_NAME} GIT_REPO=${GIT_REPO} GIT_BRANCH=${GIT_BRANCH} IMG_SRC=${IMG_SRC} \
    | oc apply -f -
elif [ "${COMMAND}" == "deploy" ]
then
  oc process -f ${OC_DEPLOY} -n ${PROJECT} -p NAME=${STATIC_PAGE_NAME} APP_DOMAIN=${STATIC_PAGE_HOSTNAME} \
    | oc apply -f -
  oc get route ${STATIC_PAGE_NAME} || \
    oc expose svc ${STATIC_PAGE_NAME}
  oc get dc ${STATIC_PAGE_NAME} -o json | grep '"image":' | awk '{ print $2 }' | tr -d ',"' \
    | tee -a ./container_img.log
else
  echo
  echo "Parameter '${COMMAND}' not understood."
  echo
fi
