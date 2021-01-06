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

- [Kubernetes Objects](https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/)
- Using the following command `oc explain pod.spec`
- [Deployment and DeploymentConfig Objects](https://docs.openshift.com/container-platform/4.5/applications/deployments/what-deployments-are.html)

## Setup Project Namespace or Environment

Login to the OpenShift portal to get a token.

`oc login --token={your token} --server=https://api.silver.devops.gov.bc.ca:6443`

Make sure you are in the appropriate project namespace when running commands for setup and configuration.

View available projects and identify which is active.

`oc get projects`

To select a project to be the active one.

`oc project 354028-dev`

### Configure Storage

The PIMS database requires persistent storage. Within OpenShift you will need to create a Persistent Volume Claim (PVC). There are two primary classes of storage, `file` and `block`. Presently the recommendation is to use `netapp-file-standard`.
If you choose `file` you can select the **Access Mode** to be `Shared Access (RWX)`, however if you choose `block` you must select `Singel User (RWO)`.
The data requirements for PIMS is fairly minimum presently, the size can be less than or equal to 3GB.

Create a configuration file here - `/pims/openshift/4.0/templates/persistent-volume-claims/dev.env`

View required and/or available parameters.

`oc process --parameters -f pims-db-storage.yaml`

Update the configuration file and set the appropriate parameters.

Review the generated template with the applied parameters.

`oc process -f pims-db-storage.yaml --param-file=dev.env`

Create the persistent volume claim and save the template.

`oc process -f pims-db-storage.yaml --param-file=dev.env | oc create --save-config=true -f -`
