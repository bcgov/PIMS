# PIMS EF Core Migrations Container

Configure **two** build configurations; one for DEV-TEST releases and one for TEST-PROD releases. Both builds should target the GitHub 'Master' branch
The template contains all network and build configs required for the migration component.

Go to - `/pims/openshift/4.0/templates/migrations`

Create a build configuration file here - `migrations.dev.env`
Update the configuration file and set the appropriate parameters.

**Example**

```conf
parameters:
  NAME=pims
  ROLE=migrations
  ENV_NAME=prod
  DESTINATION_ROLE=database
  GIT_URL=https://github.com/bcgov/PIMS.git
  GIT_REF=master
  SOURCE_CONTEXT_DIR=backend
  CPU_LIMIT=1000m
  MEMORY_LIMIT=2Gi
```

Create the migrations build and save the template.

```bash
oc project 354028-prod

oc process -f build.yaml --param-file=migrations.dev.env | oc create --save-config=true -f -
```
