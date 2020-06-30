#!/bin/bash

THIS_DIRECTORY=$(cd `dirname $0` && pwd)
ARGV=${@:2}

# the oc-scripts need to be run from the scripts folder
pushd ${THIS_DIRECTORY}/scripts > /dev/null

case "${1:-}" in
    backup)
        ./oc-backup.sh ${ARGV}
        ;;
    restore)
        echo "Not implemented yet"
        ;;
    build)
        ./oc-build.sh ${ARGV}
        ;;
    deploy)
        ./oc-deploy.sh ${ARGV}
        ;;
    sonar-scan)
        echo "Not implemented yet"
        ;;
    zap)
        echo "Not implemented yet"
        ;;
    clean)
        echo "Not implemented yet"
        ;;
    *)
    echo "You are doing it wrong..."
esac

popd > /dev/null
