#!/bin/bash
#
source "$(dirname ${0})/common.sh"

#%
#% Sonar Scanner for DotNet Core
#%
#%   This command runs a sonar scan for a Net Core codebase
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

export PATH="$PATH:/root/.dotnet/tools"

# Receive parameters (source and destination)
#
TARGET=${TARGET:-dev}
SONAR_PROJECT_KEY=${SONAR_PROJECT_KEY:-pims-api-${TARGET}}
SONAR_PROJECT_NAME=${SONAR_PROJECT_NAME:-PIMS Backend [${TARGET}]}
SONAR_URL=${SONAR_URL:-https://sonarqube-354028-tools.apps.silver.devops.gov.bc.ca}

BACKEND_DIR="${BACKEND_DIR:-../../../backend}"
TEST_DIR="${TEST_DIR:-${BACKEND_DIR}/tests/unit}"
COVERAGE_DIR="${COVERAGE_DIR:-${TEST_DIR}/TestResults}"

# Check requirements
#
dotnet tool list -g | grep sonarscanner >/dev/null 2>&1 || {
   fatal_error "sonar scanner for msbuild not installed on not in PATH"
}

# Clean up any previous test run
#
rm -rf ".sonarqube/"
rm -rf "${TEST_DIR}/dal/TestResults"
rm -rf "${TEST_DIR}/api/TestResults"
mkdir -p "${COVERAGE_DIR}"

# Begin analysis
#
CMD_SONAR_BEGIN="dotnet sonarscanner begin \
  -k:'${SONAR_PROJECT_KEY}' \
  -n:'${SONAR_PROJECT_NAME}' \
  -d:sonar.host.url='${SONAR_URL}' \
  -d:sonar.cs.opencover.reportsPaths='${COVERAGE_DIR}/coverage.opencover.xml' \
  ${SONAR_TOKEN:+ '-d:sonar.login=${SONAR_TOKEN}'}"

# Build & Test
#
CMD_BUILD="dotnet build ${BACKEND_DIR}"

test() {
  testProjs=( "api" "dal" )
  for i in "${testProjs[@]}";
  do
    projectDir="${TEST_DIR}/$i"
    dotnet test ${projectDir} -m:1 --collect:"XPlat Code Coverage" --settings ${projectDir}/coverlet.runsettings --no-restore
    mv ${projectDir}/TestResults/*/* ${COVERAGE_DIR}
  done
}

# End analysis
#
CMD_SONAR_END="dotnet sonarscanner end ${SONAR_TOKEN:+" -d:sonar.login=${SONAR_TOKEN}"}"

# Execute commands
#
if [ "${APPLY}" ]; then
  eval "${CMD_SONAR_BEGIN}"
  eval "${CMD_BUILD}"
  test
  eval "${CMD_SONAR_END}"
fi

display_helper "${CMD_SONAR_BEGIN}" "${CMD_BUILD}" "dotnet test" "${CMD_SONAR_END}"

# -----------------------------------------------------------------------------------------
# Explanation of what to do to get Coverlet to merge coverage from separate test projects
# -----------------------------------------------------------------------------------------
# If we have N test projects the flow of events would be:
#
# **Pre-conditions:**
#  - All projects export their individual coverage percents in JSON and OpenCover format
#  - There's no way to merge OpenCover xmls together (that I could find)
#  - Common folder "../TestResults" is  git ignored so nothing gets in source control
#
# **Steps:**
# Test-project 1
#   - generate coverage files (without merging)
#   - copy results to common folder "../TestResults"
# Test-project 2
#   - generate coverage files merging with previous `coverage.json`
#   - the previous `coverage.opencoverage.xml` is ignored
#   - copy results to common folder "../TestResults"
#  ...
# Test-project N
#   - generate coverage files merging with previous `coverage.json`
#   - the previous `coverage.opencoverage.xml` is ignored
#   - copy results to common folder "../TestResults"
#
# The final `coverage.opencover.xml` is the one we want
# -----------------------------------------------------------------------------------------
