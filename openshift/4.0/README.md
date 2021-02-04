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
- [OpenShift Project Tools](https://github.com/BCDevOps/openshift-developer-tools)
- [S2I Docker Push](https://github.com/BCDevOps/s2i-nginx-npm/blob/6021e7acbcbbd9fca630d65500b3d908aa95cd77/README.md)
- [Push Image](https://cookbook.openshift.org/image-registry-and-image-streams/how-do-i-push-an-image-to-the-internal-image-registry.html)

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
oc delete nsp {name}
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

### S2I Images

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

#### Apply changes to existing base images

If you make changes to the base images, you will need to push the updates to OpenShift. For this, use **oc replace** instead of oc create.

```bash
oc project 354028-tools

oc process -f dotnet-31.yaml | oc replace -f -

oc process -f msssql-2019.yaml | oc replace -f -
```

### API Database

Setup the MSSQL database for the API - [README](./templates/database/README.md)

### Database Backup

Setup the Database Backup - [README](./templates/backup/README.md)

### .NET Core API

Setup the .NET Core API - [README](./templates/api/README.md)

### React Web Application

Setup the React Web Application - [README](./templates/app/README.md)

### Configure Web Server Maintenance Caddy

Setup the Proxy Caddy Server - [README](./templates/maintenance/README.md)

### Monitoring Logs

Setup Kibana and Elasticsearch - [README](./templates/logging/README.md)

### Monitoring Performance

Setup Grafana and Prometheus - [README](./templates/monitor/README.md)
