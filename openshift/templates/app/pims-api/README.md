# How to Apply

The following commands are used to apply these files.

## Before you start

Set `${namespace_*}` to match the OpenShift project namespaces you have been assigned in the cluster (e.g. **jcxjin** for PIMS)

```bash
# tools, dev, test & prod
export namespace_tools=jcxjin-tools

export namespace_dev=jcxjin-dev

export namespace_test=jcxjin-test

export namespace_prod=jcxjin-prod
```

## TOOLS build configuration

Configure **two** build configurations; one for DEV builds and one for PROD builds.

They will target corresponding branches in GitHub: `dev` and `master`

```bash
# dev build
oc process -f pims-api-build.yaml --param-file=build-dev.env | oc -n "$namespace_tools" apply -f -

# prod (master) build
oc process -f pims-api-build.yaml --param-file=build-prod.env | oc -n "$namespace_tools" apply -f -
```

## DEV deployment

```bash
oc process -f pims-api-deploy.yaml --param-file=deploy-dev.env | oc -n "$namespace_dev" apply -f -
```

## TEST deployment

```bash
oc process -f pims-api-deploy.yaml --param-file=deploy-test.env | oc -n "$namespace_test" apply -f -
```

## PRODUCTION deployment

```bash
oc process -f pims-api-deploy.yaml --param-file=deploy-prod.env | oc -n "$namespace_prod" apply -f -
```
