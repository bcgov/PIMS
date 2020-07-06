#!/bin/bash
#
source "$(dirname ${0})/common.sh"

#%
#% Sonar Scanner for DotNet Core
#%
#%   This command runs a sonar scan for a Net Core codebase
#%
#% Usage:
#%
#%   [RELEASE_TAG=<>] ${THIS_FILE} [DEPLOY_NAME] [ENV_NAME] [-apply]
#%
#% Examples:
#%
#%   Provide a target deployment. Defaults to a dry-run.
#%   ${THIS_FILE} api dev
#%
#%   Apply when satisfied.
#%   ${THIS_FILE} api dev -apply
#%
#%   Set variables to non-defaults at runtime.  E.g. to deploy from TEST to PROD:
#%   RELEASE_TAG=test ${THIS_FILE} api prod -apply

export PATH="$PATH:/root/.dotnet/tools"

# Receive parameters (source and destination)
#
OC_JOB_NAME=${OC_JOB_NAME:-dev}
SONAR_PROJECT_KEY=${SONAR_PROJECT_KEY:-pims-backend-${OC_JOB_NAME}}
SONAR_PROJECT_NAME=${SONAR_PROJECT_NAME:-PIMS Backend [${OC_JOB_NAME}]}
SONAR_URL=${SONAR_URL:-https://sonarqube-jcxjin-tools.pathfinder.gov.bc.ca}
SONAR_TOKEN=${SONAR_TOKEN:-''}

BACKEND_PATH="${BACKEND_PATH:-../../backend}"
TESTS_PATH="${TESTS_PATH:-${BACKEND_PATH}/tests/unit}"
COVERAGE_REPORT_PATH="${COVERAGE_REPORT_PATH:-${TESTS_PATH}/TestResults}"

# Clean up any previous test run
#
rm -rf "${TESTS_PATH}/dal/TestResults"
rm -rf "${TESTS_PATH}/api/TestResults"
mkdir -p "${COVERAGE_REPORT_PATH}"

# Begin analysis
#
dotnet sonarscanner begin "-k:${SONAR_PROJECT_KEY}" "-d:sonar.host.url=${SONAR_URL}" "-d:sonar.cs.opencover.reportsPaths=${COVERAGE_REPORT_PATH}"

# Build & Test
#
dotnet build ${BACKEND_PATH}

testProjs=( "api" "dal" )
for t in ${testProjs[@]};
do
  projPath="${TESTS_PATH}/$t"
  dotnet test "${projPath}"  -m:1 --collect:"XPlat Code Coverage" --settings "${TESTS_PATH}/api/coverlet.runsettings" --no-restore
  mv ${TESTS_PATH}/$t/TestResults/*/* ${COVERAGE_REPORT_PATH}
done

# End analysis
#
dotnet sonarscanner end "/d:sonar.login=${SONAR_TOKEN}"

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
