# Property Inventory Management System

## Maintenance Mode

### Usage

Caddy pods serving static html are deployed to our prod, dev and test environments. To enable maintenance mode switch the routes between the PIMS and Proxy-Caddy services. A namespace (project) for deployment must be specified. These scrips require that oc login and oc project have been executed first.

Expected namespaces:

- jcxjin-dev
- jcxjin-test
- jcxjin-prod

For the sake of simplicity all examples will use jcxjin-test.

1. ##### Enable/Disable by Script

   Maintenance mode on.

   ```
   ./maintenance.sh test on
   ```

   Maintenance mode off.

   ```
   ./maintenance.sh test off
   ```

2. ##### Enable/Disable by Command line

   Maintenance mode on.

   ```
   oc patch route pims-app-test -n jcxjin-test -p \
       '{ "spec": { "to": { "name": "proxy-caddy", "port": { "targetPort": "2015-tcp" }}}'
   oc patch route proxy-caddy -n jcxjin-test -p \
       '{ "spec": { "to": { "name": "pims-app-test" }, "port": { "targetPort": "8080-tcp" }}}'
   ```

   Maintenance mode off.

   ```
   oc patch route pims-app-test -n jcxjin-test -p \
       '{ "spec": { "to": { "name": "pims-app-test" }, "port": { "targetPort": "8080-tcp" }}}'
   oc patch route proxy-caddy -n jcxjin-test -p \
       '{ "spec": { "to": { "name": "proxy-caddy" }, "port": { "targetPort": "2015-tcp" }}}'
   ```

### Build and Deployment

This application's template has been broken down into build and deploy components.

##### Build

Template:

- ../openshift/templates/maintenance/caddy.bc.yaml

Contains:

- ImageStream
- BuildConfig

Default vars:

- NAME: proxy-caddy
- IMG_SRC: bcgov-s2i-caddy
- GIT_REPO: https://github.com/bcgov/pims.git
- GIT_BRANCH: dev

Build Project:

- jcxjin-tools

1. ##### Build by Script

   ```
   ./maintenance.sh tools build
   ```

2. ##### Build by Command line

   ```
   oc process -f ../openshift/templates/maintenance/caddy.bc.yaml -p NAME=proxy-caddy \
     GIT_REPO=https://github.com/bcgov/pims.git GIT_BRANCH=dev \
     IMG_SRC=bcgov-s2i-caddy | oc apply -f -

   ```

##### Deploy

Template:

- ../openshift/templates/maintenance/caddy.dc.yaml

Contains:

- DeploymentConfig
- Service

Default vars:

- NAME: proxy-caddy
- BUILD_PROJECT: jcxjin-tools

Build (Source) Project:

- jcxjin-tools

Deploy Projects Available:

- jcxjin-dev
- jcxjin-test
- jcxjin-prod

1. ##### Deploy by Script

   ```
   ./maintenance.sh test deploy
   ```

2. ##### Deploy by Command line

   ```
   oc process -f ../openshift/templates/maintenance/caddy.dc.yaml -n jcxjin-test -p NAME=proxy-caddy \
       BUILD_PROJECT=jcxjin-tools | oc apply -f -
   oc expose svc proxy-caddy
   ```

3. ##### Enable/Disable by OpenShift GUI Console

   a. Navigate to [OpenShift Container Platform Console](https://console.pathfinder.gov.bc.ca:8443/console/)

   - [jcxjin-dev](https://console.pathfinder.gov.bc.ca:8443/console/project/jcxjin-dev/browse/routes)
   - [jcxjin-test](https://console.pathfinder.gov.bc.ca:8443/console/project/jcxjin-test/browse/routes)
   - [jcxjin-prod](https://console.pathfinder.gov.bc.ca:8443/console/project/jcxjin-prod/browse/routes)

   b. Edit the route to point to `proxy-caddy` service instead of the frontend application

   - [jcxjin-test](https://console.pathfinder.gov.bc.ca:8443/console/project/jcxjin-test/edit/routes/pims-app-test)

   c. Confirm that the Maintenance screen is up

   - [jcxjin-test](https://pims-test.pathfinder.gov.bc.ca/)

   Maintenance mode off.

   a. Navigate to [OpenShift Container Platform Console](https://console.pathfinder.gov.bc.ca:8443/console/)

   - [jcxjin-dev](https://console.pathfinder.gov.bc.ca:8443/console/project/jcxjin-dev/browse/routes)
   - [jcxjin-test](https://console.pathfinder.gov.bc.ca:8443/console/project/jcxjin-test/browse/routes)
   - [jcxjin-prod](https://console.pathfinder.gov.bc.ca:8443/console/project/jcxjin-prod/browse/routes)

   b. Edit the route to point back to the original frontend application (e.g. `pims-app-test`) instead of the `proxy-caddy`

   - [jcxjin-test](https://console.pathfinder.gov.bc.ca:8443/console/project/jcxjin-test/edit/routes/pims-app-test)

   c. Confirm that the Maintenance screen is up

   - [jcxjin-test](https://pims-test.pathfinder.gov.bc.ca/)

### Initial Setup

Starting from scratch the above steps will be reordered:

1. Build
2. Deploy
3. Maintenance on
4. Maintenance off

## License

Code released under the [Apache License, Version 2.0](https://github.com/bcgov/pims/blob/master/LICENSE).
