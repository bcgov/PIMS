#!/bin/bash

# Specify halt conditions (errors, unsets, non-zero pipes)
#
set -euo pipefail

THIS_DIRECTORY=$(cd `dirname $0` && pwd)
ARGV=${@:2}

# oc-scripts need to run from the scripts folder
#
pushd ${THIS_DIRECTORY}/scripts > /dev/null

case "${1:-}" in
    backup)
        ./oc-backup.sh ${ARGV}
        ;;
    restore)
        echo "Not implemented yet"
        ;;
    migrate)
        ./oc-migrate.sh ${ARGV}
        ;;
    build)
        ./oc-build.sh ${ARGV}
        ;;
    deploy)
        ./oc-deploy.sh ${ARGV}
        ;;
    scan)
        ./oc-sonar-scan.sh ${ARGV}
        ;;
    scan-dotnet)
        ./oc-sonar-dotnet.sh ${ARGV}
        ;;
    clean)
        echo "Not implemented yet"
        ;;
    *)
    echo "You are doing it wrong..."
    exit 1
esac

popd > /dev/null
