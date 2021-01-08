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

## Import base images into your TOOLS namespace

For the tech stack chosen for PIMS, we need to import the following base images into our OpenShift **tools** namespace:

* NET Core 3.1 SDK and Runtime
* Microsoft SQL Server 2019

```bash
oc process -f dotnet-31.yaml | oc -n "$namespace_tools" create -f -

oc process -f msssql-2019.yaml | oc -n "$namespace_tools" create -f -
```

## Apply changes to existing base images

If you make changes to the base images, you will need to push the updates to OpenShift. For this, use **oc replace** instead of oc create.

```bash
# make changes to yaml template, then
oc process -f dotnet-31.yaml | oc -n "$namespace_tools" replace -f -

oc process -f msssql-2019.yaml | oc -n "$namespace_tools" replace -f -
```

