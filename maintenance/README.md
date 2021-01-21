# Property Inventory Management System

## Maintenance Mode

### Usage

Caddy pods serving static html are deployed to our prod, dev and test environments. To enable maintenance mode switch the routes between the PIMS and Proxy-Caddy services. A namespace (project) for deployment must be specified. These scrips require that oc login and oc project have been executed first.

Expected namespaces:

- 354028-dev
- 354028-test
- 354028-prod

For the sake of simplicity all examples will use 354028-test.

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
   oc patch route pims-app-test -n 354028-test -p \
       '{ "spec": { "to": { "name": "proxy-caddy" }, "port": { "targetPort": "2015-tcp" }}}'
   oc patch route proxy-caddy -n 354028-test -p \
       '{ "spec": { "to": { "name": "pims-app-test" }, "port": { "targetPort": "8080-tcp" }}}'
   ```

   Maintenance mode off.

   ```
   oc patch route pims-app-test -n 354028-test -p \
       '{ "spec": { "to": { "name": "pims-app-test" }, "port": { "targetPort": "8080-tcp" }}}'
   oc patch route proxy-caddy -n 354028-test -p \
       '{ "spec": { "to": { "name": "proxy-caddy" }, "port": { "targetPort": "2015-tcp" }}}'
   ```

### Build and Deployment

This application's template has been broken down into build and deploy components. The following commands will create all required bc/dc/service/route objects, assuming that the defaults used in the maintenance script are still correct(see below to confirm:

```
./maintenance.sh tools s2i
./maintenance.sh tools build
./maintenance.sh $YOUR_TARGET_ENV deploy
```

##### S2I Build

Template:

- ../openshift/templates/maintenance/caddy.s2i.bc.yaml

Contains:

- ImageStream
- BuildConfig

Default vars:

- NAME: s2i-caddy
- GIT_REPO: https://github.com/BCDevOps/s2i-caddy.git
- GIT_REF: master
- OUTPUT_IMAGE_TAG: latest

Build Project:

- 354028-tools

##### Build

Template:

- ../openshift/templates/maintenance/caddy.bc.yaml

Contains:

- ImageStream
- BuildConfig

Default vars:

- NAME: proxy-caddy
- IMG_SRC: s2i-caddy
- GIT_REPO: https://github.com/bcgov/pims.git
- GIT_REF: dev

Build Project:

- 354028-tools

1. ##### Build by Script

   ```
   ./maintenance.sh tools s2i
   ./maintenance.sh tools build
   ```

2. ##### Build by Command line

   ```
   oc process -f ../openshift/templates/maintenance/caddy.bc.yaml -p NAME=proxy-caddy \
     GIT_REPO=https://github.com/bcgov/pims.git GIT_REF=dev \
     IMG_SRC=s2i-caddy | oc apply -f -

   ```

##### Deploy

Template:

- ../openshift/templates/maintenance/caddy.dc.yaml

Contains:

- DeploymentConfig
- Service

Default vars:

- NAME: proxy-caddy
- BUILD_PROJECT: 354028-tools

Build (Source) Project:

- 354028-tools

Deploy Projects Available:

- 354028-dev
- 354028-test
- 354028-prod

1. ##### Deploy by Script

   ```
   ./maintenance.sh test deploy
   ```

2. ##### Deploy by Command line

   ```
   oc process -f ../openshift/templates/maintenance/caddy.dc.yaml -n 354028-test -p NAME=proxy-caddy \
       BUILD_PROJECT=354028-tools | oc apply -f -
   oc expose svc proxy-caddy
   ```

3. ##### Enable/Disable by OpenShift GUI Console

   a. Navigate to [OpenShift Container Platform Console](https://console.apps.silver.devops.gov.bc.ca/)

   - [354028-dev](https://console.apps.silver.devops.gov.bc.ca/k8s/ns/354028-dev/routes/proxy-caddy)
   - [354028-test](https://console.apps.silver.devops.gov.bc.ca/k8s/ns/354028-test/routes/proxy-caddy)
   - [354028-prod](https://console.apps.silver.devops.gov.bc.ca/k8s/ns/354028-prod/routes/proxy-caddy)

   b. Edit the application route to point to `proxy-caddy` service instead of the frontend application

   - [354028-dev](https://console.apps.silver.devops.gov.bc.ca/k8s/ns/354028-dev/routes/pims-app-dev)

   c. Confirm that the Maintenance screen is up

   - [354028-dev](https://pims-dev.apps.silver.devops.gov.bc.ca)

   Maintenance mode off.

   a. Navigate to [OpenShift Container Platform Console](https://console.apps.silver.devops.gov.bc.ca/)

   - [354028-dev](https://console.apps.silver.devops.gov.bc.ca/k8s/ns/354028-dev/routes/proxy-caddy)
   - [354028-test](https://console.apps.silver.devops.gov.bc.ca/k8s/ns/354028-test/routes/proxy-caddy)
   - [354028-prod](https://console.apps.silver.devops.gov.bc.ca/k8s/ns/354028-prod/routes/proxy-caddy)

   b. Edit the route to point back to the original frontend application (e.g. `pims-app-dev`) instead of the `proxy-caddy`

   - [354028-dev](https://console.apps.silver.devops.gov.bc.ca/k8s/ns/354028-dev/routes/pims-app-dev)

   c. Confirm that the Maintenance screen is up

   - [354028-dev](https://pims-dev.apps.silver.devops.gov.bc.ca)

### Initial Setup

Starting from scratch the above steps will be reordered:

1. Build
2. Deploy
3. Maintenance on
4. Maintenance off

## License

Code released under the [Apache License, Version 2.0](https://github.com/bcgov/pims/blob/master/LICENSE).
