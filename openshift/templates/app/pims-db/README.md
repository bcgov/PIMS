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

## Ensure base SQL Server image has been added

See [README](../../base-images/README.md)

## DEV deployment

```bash
oc process -f mssql-deploy.yaml --param-file=deploy-dev.env | oc -n "$namespace_dev" apply -f -
```

## TEST deployment

```bash
oc process -f mssql-deploy.yaml --param-file=deploy-test.env | oc -n "$namespace_test" apply -f -
```

## PRODUCTION deployment

```bash
oc process -f mssql-deploy.yaml --param-file=deploy-prod.env | oc -n "$namespace_prod" apply -f -
```
