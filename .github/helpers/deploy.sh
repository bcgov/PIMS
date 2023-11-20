#!/bin/bash

# Use DeploymentConfigs to deploy the application to OpenShift.


    oc process -f /home/runner/work/PIMS/PIMS/openshift/templates/"$DC_TEMPLATE" --namespace=$NAMESPACE \
        -p LICENSE_PLATE="$LICENSE_PLATE" \
        -p IMAGE_TAG=$IMAGE_TAG \
        -p ENVIRONMENT=$ENVIRONMENT | \
        oc apply -f -
