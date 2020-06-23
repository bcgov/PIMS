#!/bin/bash

ARGV=${@:2}

case "$1" in
    backup)
        ./scripts/oc-backup.sh ${ARGV}
        ;;
    restore)
        echo "Not implemented yet"
        ;;
    build)
        echo "Not implemented yet"
        ;;
    deploy)
        echo "Not implemented yet"
        ;;
    toolbelt)
        echo "Not implemented yet"
        ;;
    scan)
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
