#!/usr/bin/env bash

echo "Fetching connection information"

IMAGE=$IMAGE_REPOSITORY/$TOOLS_NAMESPACE/$MIGRATION_IMAGE:$IMAGE_TAG

DB_CS=$(oc -n $NAMESPACE get cm pims-api-database -o jsonpath='{.data.CONNECTION_STRINGS_PIMS}')

DB_USERNAME=$(oc -n $NAMESPACE get secret $DB_NAME -o jsonpath='{.data.DB_USER}' | base64 -d)

DB_PASSWORD=$(oc -n $NAMESPACE get secret $DB_NAME -o jsonpath='{.data.DB_PASSWORD}' | base64 -d)


echo "Running database migration in $NAMESPACE"

oc run $MIGRATION_IMAGE \
    -n $NAMESPACE \
    --image=$IMAGE \
    --image-pull-policy=Always \
    --attach \
    --rm \
    --labels='role=migration,solution=pims,app=database' \
    --restart=Never \
    --env=ASPNETCORE_ENVIRONMENT=Production \
    --env=ConnectionStrings__PIMS="$DB_CS" \
    --env=DB_PASSWORD=$DB_PASSWORD
    
