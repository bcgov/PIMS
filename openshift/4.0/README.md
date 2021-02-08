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

Setup the Network Security Policies - [README](./templates/network-security-policy/README.md)

### Import Images

Setup build images - [README](../s2i/README.md)

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

### Jenkins Pipeline

Setup Jenkins CICD - [README](./templates/jenkins/README.md)

### Jenkins Agents Pipeline

Setup Jenkins CICD - [README](./templates/jenkins-slaves/README.md)
