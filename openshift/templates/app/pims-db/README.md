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

## Ensure the base SQL Server image has been added

To learn more, click [here](../../base-images/README.md).

## About template parameters

The following templates are parameterized so they can be reused for multiple configurations and environments (e.g. **dev**, **test** and **prod**). Click [here](https://docs.openshift.com/container-platform/3.11/dev_guide/templates.html) to learn more about OpenShift templates.


To find out the parameters supported by a template, run:

```bash
oc process --parameters -f mssql-deploy.yaml

# should output something like
NAME                     DESCRIPTION        VALUE
APP_NAME                 ...                pims
COMP_NAME                ...                pims-db
SQL_SERVER_RUNTIME_IMAGE ...                mssql-rhel-server:2019-latest
...
```

If you only need to customize one or two aspects of the template, it might be useful to just override the default values in the command line. This is particularly useful when you want to build things off your own GitHub repo instead of the Province of BC one.

*Example 1. Supplying your own Administrator Password*

```bash
oc process -f mssql-deploy.yaml \
  -p MSSQL_SA_PASSWORD=ChangeMeToAStrongPassword! \
  | oc -n "$namespace_dev" apply -f -
```

*Example 2. Trying out a newer version of SQL Server before pushing it to production.*

```bash
# please note sql-server 2020 does not exist at the time of writing this!
oc process -f mssql-deploy.yaml \
  -p SQL_SERVER_RUNTIME_IMAGE=mssql-server:2020 \
  | oc -n "$namespace_dev" apply -f -
```

## Using .env files

You can use **.env** files as an alternative approach to customize OpenShift templates. The .env files are simple text files with `name`=`value` pairs.

The .env files can be manually created or using the following bash commands.

The `awk` will ignore the first line (headers) and print [COL-1]=[COL-3]. The final `grep` command will ignore values of 'expression' which is the value assigned to auto-generated fields (like database passwords for example).

*Example 3. Generate .env files with default values*
```bash
oc process --parameters -f mssql-deploy.yaml | awk -F '[ ]{2,}' 'NR>1{ print $1"="$3 }' | grep -v '=expression'

# output (which you can copy-paste in an .env file)
APP_NAME=pims
COMP_NAME=pims-db
SUFFIX=dev
SQL_SERVER_RUNTIME_IMAGE=mssql-rhel-server:2019-latest
```

Or just do

```bash
oc process --parameters -f mssql-deploy.yaml | awk -F '[ ]{2,}' 'NR>1{ print $1"="$3 }' | grep -v '=expression' > deploy.env
```

## DEV deployment

:zap: **IMPORTANT** - Before applying these templates make sure you understand how parameters work and have your own `.env` files ready.

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
