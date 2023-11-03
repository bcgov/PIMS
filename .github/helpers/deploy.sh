#!/bin/bash

# Use DeploymentConfigs to deploy the application to OpenShift.


    oc process -f /home/runner/work/PIMS/PIMS/openshift/templates/"$DC_TEMPLATE" --namespace=$NAMESPACE \
        -p APPLICATION_NAME=$APPLICATION_NAME \
        -p NAMESPACE=$NAMESPACE \
        -p IMAGE_TAG=$IMAGE_TAG \
        -p ENVIRONMENT=$ENVIRONMENT | \
        oc apply -f -