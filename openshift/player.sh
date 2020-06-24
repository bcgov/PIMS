#!/bin/bash

ARGV=${@:2}

case "$1" in
    backup)
        cd scripts
        ./oc-backup.sh ${ARGV}
        cd ..
        ;;
    restore)
        echo "Not implemented yet"
        ;;
    build)
        cd scripts
        ./oc-build.sh ${ARGV}
        cd ..
        ;;
    deploy)
        cd scripts
        ./oc-deploy.sh ${ARGV}
        cd ..
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
    echo "You\'re doing it wrong..."
esac
