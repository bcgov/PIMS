#!/bin/bash
#
source "$(dirname ${0})/common.sh"

#%
#% Sonar Scanner for Javascript/Typescript
#%
#%   This command runs a sonar scan for a typescript codebase
#%   Targets incl.: pr-###, dev and master.
#%
#% Usage:
#%
#%   ${THIS_FILE} [JOB_NAME] [-apply]
#%
#% Examples:
#%
#%   Provide a job name. Defaults to a dry-run.
#%   ${THIS_FILE} dev
#%
#%   Apply when satisfied.
#%   ${THIS_FILE} dev -apply
#%
#%   Set variables to non-defaults at runtime.
#%   SONAR_URL=http://localhost:9000 SONAR_PROJECT_KEY=my-project-key ${THIS_FILE} dev -apply

# Receive parameters (source and destination)
#
TARGET=${TARGET:-dev}
SONAR_PROJECT_KEY=${SONAR_PROJECT_KEY:-pims-frontend-${TARGET}}
SONAR_PROJECT_NAME=${SONAR_PROJECT_NAME:-PIMS Frontend [${TARGET}]}
SONAR_URL=${SONAR_URL:-https://sonarqube-jcxjin-tools.pathfinder.gov.bc.ca}
ZAP_REPORT=${ZAP_REPORT:-}

FRONTEND_DIR="${FRONTEND_DIR:-../../../frontend}"

# Check requirements
#
which sonar-scanner >/dev/null 2>&1 || {
  fatal_error "sonar-scanner not installed on not in PATH"
}

# Clean up any previous test run
#
rm -rf ".sonarqube/"

# Unit tests & coverage
#
CMD_TEST="npm run coverage"

# Begin analysis
#
CMD_SONAR_SCAN="sonar-scanner \
  -Dsonar.projectKey='pims-frontend-${TARGET}' \
  -Dsonar.projectName='PIMS Frontend [${TARGET}]' \
  -Dsonar.host.url='${SONAR_URL}' \
  ${SONAR_TOKEN:+ -Dsonar.login='${SONAR_TOKEN}'} \
  ${ZAP_REPORT:+ -Dsonar.zaproxy.reportPath='${ZAP_REPORT}'}"

# Execute commands
#
if [ "${APPLY}" ]; then
  pushd ${FRONTEND_DIR}
  eval "${CMD_TEST}"
  eval "${CMD_SONAR_SCAN}"
  popd
fi

display_helper "${CMD_TEST}" "${CMD_SONAR_SCAN}"
