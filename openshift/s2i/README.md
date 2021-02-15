# Import Images

For the tech stack chosen for PIMS, we need to import the following base images into our OpenShift **tools** namespace:

- NET Core 3.1 SDK and Runtime
- Microsoft SQL Server 2019

Go to - `/pims/openshift/4.0/templates/base-images`

```bash
oc project 354028-tools

oc process -f dotnet-31.yaml | oc create -f -

oc process -f mssql-2019.yaml | oc create -f -
```

## S2I Images

PIMS uses a custom **Source-to-Image (S2I)** Nginx image that requires you to build and push to the Image Repository.

Go to - `/openshift/s2i/nginx-runtime`

Create an image stream for this image.

```bash
oc process -f nginx-runtime.yaml | oc create -f -
```

Build and tag the image.

```bash
docker build -t nginx-runtime .
docker tag nginx-runtime image-registry.apps.silver.devops.gov.bc.ca/354028-tools/nginx-runtime
```

Login to OpenShift with docker and push the image to the Image Repository.

```bash
docker login -u $(oc whoami) -p $(oc whoami -t) image-registry.apps.silver.devops.gov.bc.ca
# Or apparently you can run this command.
oc registry login

docker push image-registry.apps.silver.devops.gov.bc.ca/354028-tools/nginx-runtime
```

### Apply changes to existing base images

If you make changes to the base images, you will need to push the updates to OpenShift. For this, use **oc replace** instead of oc create.

```bash
oc project 354028-tools

oc process -f dotnet-31.yaml | oc replace -f -

oc process -f msssql-2019.yaml | oc replace -f -
```
