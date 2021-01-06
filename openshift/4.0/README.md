# OpenShift 4.0 Setup

[Portal](https://console.apps.silver.devops.gov.bc.ca/k8s/cluster/projects)

## Projects

| Name  | Namespace                                                                                | Description                                              |
| ----- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| TOOLS | [354028](https://console.apps.silver.devops.gov.bc.ca/k8s/cluster/projects/354028-tools) | DevOps tools for CI/CD, and monitoring.                  |
| DEV   | [354028](https://console.apps.silver.devops.gov.bc.ca/k8s/cluster/projects/354028-dev)   | Initial developer testing and quality assurance.         |
| TEST  | [354028](https://console.apps.silver.devops.gov.bc.ca/k8s/cluster/projects/354028-test)  | User acceptance testing and confirmation before release. |
| PROD  | [354028](https://console.apps.silver.devops.gov.bc.ca/k8s/cluster/projects/354028-prod)  | Production environment to support the client.            |

## Helpful Documentation

- [Issues](https://github.com/BCDevOps/OpenShift4-Migration/issues?page=2&q=is%3Aissue+is%3Aopen)
- [Kubernetes Objects](https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/)
- Using the following command `oc explain pod.spec`
- [Deployment and DeploymentConfig Objects](https://docs.openshift.com/container-platform/4.5/applications/deployments/what-deployments-are.html)
- [Custom Network Security Policy Development](https://developer.gov.bc.ca/Custom-Network-Security-Policy-Development)
- [Docker & Artifactory Implementation Details](https://github.com/BCDevOps/OpenShift4-Migration/issues/51)
- [Artifact Respositories](https://developer.gov.bc.ca/Artifact-Repositories)

When using template parameters you can use the following syntax to control the output.

- String Parameter: `${PARAM_NAME}` = `"value"`
- Numeric Parameter: `${{PARAM_NAME}}` = `value`

## Setup Project Namespace or Environment

Login to the OpenShift portal to get a token.

```bash
oc login --token={your token} --server=https://api.silver.devops.gov.bc.ca:6443
```

Make sure you are in the appropriate project namespace when running commands for setup and configuration.

View available projects and identify which is active.

```bash
oc get projects
```

To select the appropriate project to be the active one.

```bash
oc project 354028-dev
```

### Network Security Policy

Each project namespace is by default a [Zero Trust Security Model](https://developer.gov.bc.ca/Platform-Services-Security/Developer-Guide-to-Zero-Trust-Security-Model-on-the-Platform).

Configure each project namespace with the appropriate Network Security Policy (NSP) to enable appropriate communication between projects, pods, internal k8s cluster api and the internet.

To simplify NSP **label** your **DeploymentConfig** objects with `app`, `role` and `env` (or any other appropriate label to identify them).

```yaml
- kind: DeploymentConfig
  apiVersion: v1
  metadata:
    name: pims-web-dc
    labels:
      app: pims
      role: web
      env: prod
    annotations:
      description: How to deploy the pims web application pod.
  spec:
    strategy:
  ...
```

Go to - `/pims/openshift/4.0/templates/network-security-policy`

Configure the TOOLS project namespace.

```bash
oc process -f nsp-tools.yaml | oc create --save-config=true -f -
```

Create a configuration file for each environment `nsp.dev.env`, `nsp.test.env`, `nsp.prod.env`.
Configure each file appropriately for each environment.

**Example**

```conf
ENV_NAME=dev
```

Configure each environment project namespace (DEV, TEST, PROD).

```bash
oc process -f nsp.yaml --param-file=nsp.dev.env | oc create --save-config=true -f -
oc process -f nsp.yaml --param-file=nsp.test.env | oc create --save-config=true -f -
oc process -f nsp.yaml --param-file=nsp.prod.env | oc create --save-config=true -f -
```

If at any time an update needs to be made to the NSP, update the templates and run the `apply` command.

Enable the **Service Account** to pull images from external sources.

```bash
oc project 354028-dev
oc policy add-role-to-user system:image-puller system:serviceaccount:$(oc project --short):default -n 354028-tools

oc project 354028-test
oc policy add-role-to-user system:image-puller system:serviceaccount:$(oc project --short):default -n 354028-tools

oc project 354028-prod
oc policy add-role-to-user system:image-puller system:serviceaccount:$(oc project --short):default -n 354028-tools
```

**Example**

```bash
oc process -f {template file name} --param-file={parameter file name} | oc apply -f -
```

Also remember to delete any NSP that are no longer relevant.

**Example**

```bash
oc delete networksecuritypolicy {name}
```

### Import Images

For the tech stack chosen for PIMS, we need to import the following base images into our OpenShift **tools** namespace:

- NET Core 3.1 SDK and Runtime
- Microsoft SQL Server 2019

Go to - `/pims/openshift/4.0/templates/base-images`

```bash
oc project 354028-tools

oc process -f dotnet-31.yaml | oc create -f -

oc process -f mssql-2019.yaml | oc create -f -
```

#### Apply changes to existing base images

If you make changes to the base images, you will need to push the updates to OpenShift. For this, use **oc replace** instead of oc create.

```bash
oc project 354028-tools

oc process -f dotnet-31.yaml | oc replace -f -

oc process -f msssql-2019.yaml | oc replace -f -
```

### Configure Storage

The PIMS database requires persistent storage. Within OpenShift you will need to create a Persistent Volume Claim (PVC). There are two primary classes of storage, `file` and `block`. Presently the recommendation is to use `netapp-file-standard`.
If you choose `file` you can select the **Access Mode** to be `Shared Access (RWX)`, however if you choose `block` you must select `Singel User (RWO)`.
The data requirements for PIMS is fairly minimum presently, the size can be less than or equal to 3GB.

Go to - `/pims/openshift/4.0/templates/persistent-volume-claims`

Create a configuration file here - `dev.env`

View required and/or available parameters.

```bash
oc process --parameters -f pims-db-storage.yaml
```

Update the configuration file and set the appropriate parameters.

**Example**

```conf
ENV_NAME=dev
```

Review the generated template with the applied parameters.

```bash
oc process -f pims-db-storage.yaml --param-file=dev.env
```

Create the persistent volume claim and save the template.

```bash
oc project 354028-dev

oc process -f pims-db-storage.yaml --param-file=dev.env | oc create --save-config=true -f -
```

### Configure Database

The PIMS database is a MS SQL Server linux container.

Go to - `/pims/openshift/4.0/templates/database`

Create a build configuration file here - `build.dev.ev`
Update the configuration file and set the appropriate parameters.

**Example**

```conf
GIT_REF=dev
CONTEXT_DIR=database/mssql
OUTPUT_IMAGE_TAG=latest
CPU_LIMIT=2
MEMORY_LIMIT=6Gi
```

Create the database build and save the template.

```bash
oc project 354028-tools

oc process -f mssql-build.yaml --param-file=build.dev.env | oc create --save-config=true -f -
```

Create a deployment configuration file here - `deploy.dev.ev`
Update the configuration file and set the appropriate parameters.

**Example**

```conf
ENV_NAME=dev
IMAGE_TAG=latest
MSSQL_PID=Developer
DB_NAME=pims
DB_USER=admin
PVC_NAME=pims-db-file-storage
CPU_REQUEST=100m
CPU_LIMIT=2c
MEMORY_REQUEST=500MiB
MEMORY_LIMIT=4GiB
```

Create the database deploy and save the template.

```bash
oc process -f mssql-deploy.yaml --param-file=deploy.dev.env | oc create --save-config=true -f -
```
