#!/bin/bash
#%
#% OpenShift Common Script
#%
#%   To be consumed by a set of OpenShift scripts with a pull request-based pipeline.
#%   See individual scripts for more information.
#%

# Specify halt conditions (errors, unsets, non-zero pipes), field separator and verbosity
#
set -euo pipefail
IFS=$'\n\t'
[ ! "${VERBOSE:-}" == "true" ] || set -x

# Receive parameters
#
TARGET=${1:-}
LAST_ARG=$(for last in ${@:-''}; do :; done && echo "${last}")
APPLY=$([ "${LAST_ARG:-}" != "-apply" ] || echo true)

# Load environment variables from a file
#
source "$(dirname ${0})/envars"

# If no parameters have been passed show the help header from this script
#
[ "${#}" -gt 0 ] || {
  THIS_FILE="$(dirname ${0})/$(basename ${0})"

  # Cat this file, grep #% lines and clean up with sed
  cat ${THIS_FILE} |
    grep "^#%" |
    sed -e "s|^#%||g" |
    sed -e "s|\${THIS_FILE}|${THIS_FILE}|g"
  exit 1
}

# Verify login
#
$(oc whoami &>/dev/null) || {
  echo -e "\nPlease verify oc login\n"
  exit 1
}

# Echo commands and dry run warnings
#
display_helper() {
  set +e
  if [ ! "${APPLY}" ]; then
    echo -e "\n*** This is a dry run.  Use '-apply' to do a real run. ***\n"
    echo -e "OC commands that would be executed"
    echo -e "==================================\n"
  else
    echo -e "\nOC commands executed"
    echo -e "====================\n"
  fi
  for i in $*; do
    echo -e "  $i"
  done
  set -e
}

_log_error() {
  echo "$@" 1>&2
}

fatal_error() {
  _log_error "Fatal:" "$@"
  exit 1
}

_log() {
  echo "$@"
}
