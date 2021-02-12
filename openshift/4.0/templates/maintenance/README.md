# Maintenance Web Server Caddy

The proxy caddy provides a way to redirec traffic temporarily during a maintenance period.
This container is an S2I provided by the BC DevOps team - [https://github.com/BCDevOps/s2i-caddy](https://github.com/BCDevOps/s2i-caddy).
An example caddy configuration [here](https://gist.github.com/jleach/9b1f9e1fa7083feae8132b004d06aa98).

> Unable to get the S2I proxy caddy to work.

Go to - `/pims/openshift/s2i/bcgov-s2i-caddy`

```bash
oc process -f bcgov-s2i-caddy.yaml | oc create -f -
```

Clone the BC Gov repo and build and tag the image.

```bash
docker build -t bcgov-s2i-caddy .
docker tag bcgov-s2i-caddy image-registry.apps.silver.devops.gov.bc.ca/354028-tools/bcgov-s2i-caddy
```

Login to OpenShift with docker and push the image to the Image Repository.

```bash
docker login -u $(oc whoami) -p $(oc whoami -t) image-registry.apps.silver.devops.gov.bc.ca
# Or apparently you can run this command somehow # oc registry login

docker push image-registry.apps.silver.devops.gov.bc.ca/354028-tools/bcgov-s2i-caddy
```

> Also attempted to pull latest image from DockerHub [caddy](https://hub.docker.com/_/caddy)

The following gets an image from DockerHub and pushes it to our image registry.

```bash
docker pull caddy
docker tag caddy image-registry.apps.silver.devops.gov.bc.ca/354028-tools/caddy
docker push image-registry.apps.silver.devops.gov.bc.ca/354028-tools/caddy
```

## Build Configuration

Go to - `/pims/openshift/4.0/templates/maintenance`

Create a build configuration file here - `build.dev.env`
Update the configuration file and set the appropriate parameters.

**Example**

```conf
GIT_REPO=https://github.com/bcgov/pims.git
GIT_REF=dev
IMG_SRC=bcgov-s2i-caddy
OUTPUT_IMAGE_TAG=dev
```

Create the api build and save the template.

```bash
oc project 354028-tools
oc process -f caddy.bc.yaml --param-file=build.dev.env | oc create --save-config=true -f -
```

You may need to manually run the build config.

```bash
oc start-build proxy-caddy
```

## Deployment Configuration

Create a deployment configuration file here - `deploy-proxy-caddy.dev.env`
Update the configuration file and set the appropriate parameters.

**Example**

```conf
ENV_NAME=dev
IMAGE_TAG=dev
APP_DOMAIN=proxy-caddy-pims-dev.apps.silver.devops.gov.bc.ca
APP_PORT=2015
CPU_REQUEST=100m
CPU_LIMIT=1
MEMORY_REQUEST=500Mi
MEMORY_LIMIT=4Gi
```

Create the api deployment and save the template.

```bash
oc project 354028-dev
oc process -f caddy.dc.yaml --param-file=deploy.dev.env | oc create --save-config=true -f -
```

## Testing

After the caddy-proxy pod is running you can test the maintenance script.

Go to - `/pims/maintenance`

Turn on the maintenance page.

```bash
./maintenance.sh dev on
```

Go to [https://pims-dev.apps.silver.devops.gov.bc.ca](https://pims-dev.apps.silver.devops.gov.bc.ca) and it will display the maintenance page.

Turn off the maintenance page.

```bash
./maintenance.sh dev off
```

Go to [https://pims-dev.apps.silver.devops.gov.bc.ca](https://pims-dev.apps.silver.devops.gov.bc.ca) and it will display the application.
