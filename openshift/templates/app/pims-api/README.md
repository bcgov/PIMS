# How to Apply

The following commands are used to apply these files.

## Before you start

Set `${oc_env_*}` to match the OpenShift project namespace you have been assigned in the cluster (e.g. **jcxjin** for PIMS)

```bash
export oc_env_tools=jcxjin-tools
export oc_env_dev=jcxjin-dev
export oc_env_test=jcxjin-test
export oc_env_prod=jcxjin-prod
```

## TOOLS build configuration

Configure **two** build configurations; one for DEV builds and one for PROD builds.

They will target corresponding branches in GitHub: `dev` and `master`

```bash
# dev
oc process -f pims-api-build.yaml --param-file=build-dev.env | oc -n $oc_env_tools apply -f -

# prod
oc process -f pims-api-build.yaml --param-file=build-prod.env | oc -n $oc_env_tools apply -f -
```

## DEV deployment

```bash
oc process -f pims-api-deploy.yaml --param-file=deploy-dev.env | oc -n $oc_env_dev apply -f -
```

## TEST deployment

```bash
oc process -f pims-api-deploy.yaml --param-file=deploy-test.env | oc -n $oc_env_test apply -f -
```

## PRODUCTION deployment

```bash
oc process -f pims-api-deploy.yaml --param-file=deploy-prod.env | oc -n $oc_env_prod apply -f -
```
