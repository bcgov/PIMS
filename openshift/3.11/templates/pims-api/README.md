# How to Apply

The following commands are used to apply these files.

# Before you start

Set `${namespace_*}` to match the OpenShift project namespaces you have been assigned in the cluster (e.g. **jcxjin** for PIMS)

```bash
# tools, dev, test & prod
export namespace_tools=jcxjin-tools

export namespace_dev=jcxjin-dev

export namespace_test=jcxjin-test

export namespace_prod=jcxjin-prod
```

# 1 Build Configuration

**IMPORTANT** - Before applying these templates make sure you understand how parameters work and have your own `.env` files ready.

:zap: Read section [Customizing template parameters](#customizing-template-parameters) to learn how to customize these templates with your own parameters.

## TOOLS build configuration

Configure **two** build configurations; one for DEV builds and one for PROD builds. The development build should target the **`dev`** branch in GitHub, while the production build should target the **`master`** branch. Make sure you have `.env` files setup for each configuration.

#### Development Build

```bash
cd openshift/templates/app/pims-api
oc process -f build.yaml -p GIT_REF=dev | oc -n "$namespace_tools" apply -f -
```

#### Master Build

```bash
cd openshift/templates/app/pims-api
oc process -f build.yaml -p GIT_REF=master | oc -n "$namespace_tools" apply -f -
```

#### If you want to customize things beyond the branch to build

```bash
# supply an .env file with your own parameters
oc process -f build.yaml --param-file=[.env] | oc -n "$namespace_tools" apply -f -
```

# 2 Deployment Configuration

**IMPORTANT** - Before applying these templates make sure you understand how parameters work and have your own `.env` files ready.

:zap: Read section [Customizing template parameters](#customizing-template-parameters) to learn how to customize these templates with your own parameters.

### Using Default Configurations

If you are just trying to stand up the various cloud environments that this project uses and are not interested in applying any customizations, execute the commands below which will populate DEV, TEST and PROD with default values.

```bash
cd openshift/templates/app/pims-api

oc project $namespace_dev
oc process -f deploy.yaml -p ENV_NAME=dev -p APPLICATION_DOMAIN=pims-dev.pathfinder.gov.bc.ca | oc create -f -

oc project $namespace_test
oc process -f deploy.yaml -p ENV_NAME=test -p APPLICATION_DOMAIN=pims-test.pathfinder.gov.bc.ca | oc create -f -

oc project $namespace_prod
oc process -f deploy.yaml -p ENV_NAME=prod -p APPLICATION_DOMAIN=pims.pathfinder.gov.bc.ca | oc create -f -

```

### DEV Deployment With Custom Values

```bash
# supply an .env file with your own parameters
oc process -f deploy.yaml --param-file=[.env] | oc -n "$namespace_dev" apply -f -
```

### TEST Deployment With Custom Values

```bash
# supply an .env file with your own parameters
oc process -f deploy.yaml --param-file=[.env] | oc -n "$namespace_test" apply -f -
```

### PRODUCTION Deployment With Custom Values

```bash
# supply an .env file with your own parameters
oc process -f deploy.yaml --param-file=[.env] | oc -n "$namespace_prod" apply -f -
```

# Customizing OpenShift Templates

The OpenShift templates referenced here are parameterized so they can be reused for multiple configurations and environments (e.g. **dev**, **test** and **prod**). Click [here](https://docs.openshift.com/container-platform/3.11/dev_guide/templates.html) to learn more about OpenShift templates.

To find out the parameters supported by a template, run:

```bash
cd openshift/templates/app/pims-api
oc process --parameters -f build.yaml

# should output something like
NAME                     DESCRIPTION        VALUE
APP_NAME                 ...                pims
COMP_NAME                ...                api
GIT_REPO_URL             ...                https://github.com/bcgov/PIMS.git
GIT_REF                  ...                dev
SOURCE_CONTEXT_DIR       ...                backend
DOTNET_BUILDER_IMAGE     ...                dotnet-31-rhel7
DOTNET_BUILDER_TAG       ...                3.1
DOTNET_STARTUP_PROJECT   ...                pims.api.csproj
CPU_LIMIT                ...                1
MEMORY_LIMIT             ...                6Gi
```

If you only need to customize one or two aspects of the template, it might be useful to just override the default values in the command line. This is particularly useful when you want to build things off your own GitHub repo instead of the Province of BC one.

_Example 1. Creating a build configuration from a different repo and branch_

```bash
cd openshift/templates/app/pims-api

oc process -f build.yaml \
  -p GIT_REPO_URL=https://github.com/{my_github_username}/PIMS.git \
  -p GIT_REF=my_feature_branch \
  | oc -n "$namespace_tools" apply -f -
```

_Example 2. Try out a newer version of .NET Core before pushing it to production._

```bash
cd openshift/templates/app/pims-api

# please note dotnet core 5.0 does not exist at the time of writing this!
oc process -f build.yaml \
  -p DOTNET_BUILDER_IMAGE=dotnet:5.0 \
  | oc -n "$namespace_tools" apply -f -
```

### Using .env files

You can use **.env** files as an alternative approach to customize OpenShift templates. The .env files are simple text files with `name`=`value` pairs.

The .env files can be manually created or using the following bash commands.

The `awk` will ignore the first line (headers) and print [COL-1]=[COL-3]. The final `grep` command will ignore values of 'expression' which is the value assigned to auto-generated fields (like database passwords for example).

_Example 3. Generate .env files with default values_

```bash
oc process --parameters -f pims-api-build.yaml | awk -F '[ ]{2,}' 'NR>1{ print $1"="$3 }' | grep -v '=expression'

# output (which you can copy-paste in an .env file)
APP_NAME=pims
COMP_NAME=api
GIT_REPO_URL=https://github.com/bcgov/PIMS.git
GIT_REF=dev
SOURCE_CONTEXT_DIR=backend

DOTNET_BUILDER_IMAGE=dotnet-31-rhel7
DOTNET_BUILDER_TAG=3.1
DOTNET_STARTUP_PROJECT=pims.api.csproj

CPU_LIMIT=1
MEMORY_LIMIT=6Gi
```

Or just do

```bash
cd openshift/templates/app/pims-api

oc process --parameters -f build.yaml | awk -F '[ ]{2,}' 'NR>1{ print $1"="$3 }' | grep -v '=expression' > build.env
```
