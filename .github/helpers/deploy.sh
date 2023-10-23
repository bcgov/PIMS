#!/bin/bash

# Use DeploymentConfigs to deploy the application to OpenShift.

oc process -f /home/runner/work/PIMS/PIMS/openshift/templates/$DEPLOYMENT_CONFIG --namespace="ec1236-dev" | \
  oc apply -f -