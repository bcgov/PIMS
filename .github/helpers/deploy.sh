#!/bin/bash

# Use DeploymentConfigs to deploy the application to OpenShift.

if [ "$APPLICATION_NAME" = "pims-api" ]; then
    oc process -f /home/runner/work/PIMS/PIMS/openshift/templates/"$DC_TEMPLATE" --namespace=$NAMESPACE \
        -p LICENSE_PLATE="$LICENSE_PLATE" \
        -p IMAGE_TAG=$IMAGE_TAG \
        -p ASPNETCORE_ENVIRONMENT=$ASPNETCORE_ENVIRONMENT \
        -p EMAIL_AUTHORIZED="$EMAIL_AUTHORIZED" \
        -p ENVIRONMENT=$ENVIRONMENT | \
        oc apply -f -

else
    if [ -z "$VAULT_ENVIRONMENT" ]; then
        oc process -f /home/runner/work/PIMS/PIMS/openshift/templates/"$DC_TEMPLATE" --namespace=$NAMESPACE \
            -p LICENSE_PLATE="$LICENSE_PLATE" \
            -p IMAGE_TAG=$IMAGE_TAG \
            -p ENVIRONMENT=$ENVIRONMENT | \
            oc apply -f -

    else
        oc process -f /home/runner/work/PIMS/PIMS/openshift/templates/"$DC_TEMPLATE" --namespace=$NAMESPACE \
            -p LICENSE_PLATE="$LICENSE_PLATE" \
            -p IMAGE_TAG=$IMAGE_TAG \
            -p VAULT_ENVIRONMENT=$VAULT_ENVIRONMENT \
            -p ENVIRONMENT=$ENVIRONMENT | \
            oc apply -f -
fi
