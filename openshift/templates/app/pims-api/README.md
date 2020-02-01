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

## About template parameters

The following templates are parameterized so they can be reused for multiple configurations and environments (e.g. **dev**, **test** and **prod**). Click [here](https://docs.openshift.com/container-platform/3.11/dev_guide/templates.html) to learn more about OpenShift templates.


To find out the parameters supported by a template, run:

```bash
oc process --parameters -f pims-api-build.yaml

# should output something like
NAME                     DESCRIPTION        VALUE
APP_NAME                 ...                pims
COMP_NAME                ...                pims-api
SUFFIX                   ...                dev
GIT_REPO_URL             ...                https://github.com/bcgov/PIMS.git
GIT_REF                  ...                dev
SOURCE_CONTEXT_DIR       ...                backend
DOTNET_BUILDER_IMAGE     ...                dotnet-31-rhel7:3.1
DOTNET_STARTUP_PROJECT   ...                BackendApi.csproj
CPU_LIMIT                ...                1
MEMORY_LIMIT             ...                6Gi

```

If you only need to customize one or two aspects of the template, it might be useful to just override the default values in the command line. This is particularly useful when you want to build things off your own GitHub repo instead of the Province of BC one.

*Example 1. Creating a build configuration from a different repo and branch*

```bash
oc process -f pims-api-build.yaml \
  -p GIT_REPO_URL=https://github.com/{my_github_username}/PIMS.git \
  -p GIT_REF=my_feature_branch \
  | oc -n "$namespace_tools" apply -f -
```

*Example 2. Try out a newer version of .NET Core before pushing it to production.*

```bash
# please note dotnet core 5.0 does not exist at the time of writing this!
oc process -f pims-api-build.yaml \
  -p DOTNET_BUILDER_IMAGE=dotnet:5.0 \
  | oc -n "$namespace_tools" apply -f -
```

## Using .env files

You can use **.env** files as an alternative approach to customize OpenShift templates. The .env files are simple text files with `name`=`value` pairs.

The .env files can be manually created or using the following bash commands.

The `awk` will ignore the first line (headers) and print [COL-1]=[COL-3]. The final `grep` command will ignore values of 'expression' which is the value assigned to auto-generated fields (like database passwords for example).

*Example 3. Generate .env files with default values*
```bash
oc process --parameters -f pims-api-build.yaml | awk -F '[ ]{2,}' 'NR>1{ print $1"="$3 }' | grep -v '=expression'

# output (which you can copy-paste in an .env file)
APP_NAME=pims
COMP_NAME=pims-api
SUFFIX=dev
GIT_REPO_URL=https://github.com/bcgov/PIMS.git
GIT_REF=dev
SOURCE_CONTEXT_DIR=backend
DOTNET_BUILDER_IMAGE=dotnet-31-rhel7:3.1
DOTNET_STARTUP_PROJECT=BackendApi.csproj
CPU_LIMIT=1
MEMORY_LIMIT=6Gi
```

Or just do

```bash
oc process --parameters -f pims-api-build.yaml | awk -F '[ ]{2,}' 'NR>1{ print $1"="$3 }' | grep -v '=expression' > build.env
```

## TOOLS build configuration

:zap: **IMPORTANT** - Before applying these templates make sure you understand how parameters work and have your own `.env` files ready.

Configure **two** build configurations; one for DEV builds and one for PROD builds. The development build should target the **`dev`** branch in GitHub, while the production build should target the **`master`** branch. Make sure you have `.env` files setup for each configuration.

```bash
# dev build
oc process -f pims-api-build.yaml --param-file=build-dev.env | oc -n "$namespace_tools" apply -f -

# prod (master) build
oc process -f pims-api-build.yaml --param-file=build-master.env | oc -n "$namespace_tools" apply -f -
```

## DEV deployment

```bash
# make sure you create a deploy.env first!
oc process -f pims-api-deploy.yaml --param-file=deploy-dev.env | oc -n "$namespace_dev" apply -f -
```

## TEST deployment

```bash
# make sure you create a deploy.env first!
oc process -f pims-api-deploy.yaml --param-file=deploy-test.env | oc -n "$namespace_test" apply -f -
```

## PRODUCTION deployment

```bash
# make sure you create a deploy.env first!
oc process -f pims-api-deploy.yaml --param-file=deploy-prod.env | oc -n "$namespace_prod" apply -f -
```
