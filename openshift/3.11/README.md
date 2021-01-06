# OpenShift Environment Configuration

This project uses OpenShift container platform (v3.11) for hosting the application and deploying/running any services required by it.

## Environments

There are 4 environments setup in the OpenShift Platform.

- **Tools** - Contains all the tools/external services required by the application.
- **Dev** - Contains a running application instance of an open pull request branch.
- **Test** - Contains a running application instance of the current release branch.
- **Prod** - Contains a running application instance of the current state of master.

## Application Components

| Name          | Description                                                                                                                               | Link                                                                                  |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Nodejs 10     | This application uses a Nodejs (v10) runtime environment to run the frontend.                                                             | [s2i image](https://github.com/sclorg/s2i-nodejs-container/tree/master/10)            |
| .NET Core 3.1 | This application uses a .NET Core (v3.1) environment to create a REST API that handles interaction between the frontend and the database. | [s2i image](https://github.com/redhat-developer/s2i-dotnetcore/tree/master/3.1/build) |
| SQL Server    | This application uses a Microsoft SQL Server database to store and retrieve data from.                                                    | [docker image](https://hub.docker.com/_/microsoft-mssql-server)                       |

## Filename Convention

Files in this folder are named with the following convention in mind:

| Object      | Description                                                                                                     |
| ----------- | --------------------------------------------------------------------------------------------------------------- |
| build.yaml  | Build configuration for the application. Used for building any images required by the deployment configuration. |
| deploy.yaml | Deployment configuration for the application. These deployment pods are long lived.                             |
| test.yaml   | Deployment configuration to spin up a container and run unit-tests. This does not create an image or a pod.     |

## Getting Started

Follow the instructions below to setup all the components required to run PIMS in Openshift.

1. [Base Images](./BASE_IMAGES.md)
1. [Secrets](./SECRETS.md) - _optional_
1. [Objects](./OBJECTS.md)
1. [Jenkins Slaves](./JENKINS_SLAVES.md) - _optional, unless running unit tests in the CI/CD pipeline_
1. [Pipelines](./PIPELINES.md)
1. [SonarQube](./SONARQUBE.md)
1. [ZAP](./ZAP.md)
1. [Monitoring](./templates/monitoring/README.md)
1. [Logging](./templates/logging/README.md)
1. [SSL Certificates](./SSL_CERTIFICATES.md) - for top level domains (e.g. https://pims.gov.bc.ca)

### Multiple Instances

You can configure and run multiple instances of PIMS in any environment (OpenShift Project).
To do this all you need to do is provide the `ID` parameter in the _deployments_, update the appropriate hostname parameters and add the hostname to Keycloak client `pims-app`.

- Valid Redirect URIs = https://{your domain path}.pathfinder.gov.bc.ca/\*
- Web Origins = https://{your domain path}.pathfinder.gov.bc.ca
- **Read more** - [here](./MULTIPLE_INSTANCES.md)

## Resources & Troubleshooting

### More Information Available At

[Link to OpenShift Documentation](https://docs.openshift.com/container-platform/3.11/using_images/other_images/jenkins.html)

[Link to the Jenkins s2i image](https://github.com/BCDevOps/openshift-components/tree/master/cicd/jenkins)

### Remoting Into The Database

To make a remote connection to a container in OpenShift you will need to open a local port to the remote container.

1. From OpenShift web interface Copy Login Command from the button in the top right corner.
2. Paste the login command into bash and hit enter to log in.
3. Switch your openshift environment in bash to the one you intend to modify using the command

   ```bash
   oc project <your-tools-project>
   ```

4. Get pod ids. Find the pod name that hosts your database and you want to remote into and save it for the next step (i.e. \$PODNAME=_mssql-00-foo_).

   ```bash
   oc get pods
   ```

5. Create a local port to connect your client to using the command:

   ```bash
   oc port-forward $PODNAME $LOCALPORT:$CONTAINERPORT
   ```

   \$LOCALPORT = The port you want to forward to locally.

   \$CONTAINERPORT = The port open on the container that communicates with the database.

6. Configure your client to connect to the \$LOCALPORT you have selected with the host name/ip of `127.0.0.1`

   - Please note that _localhost_ will not work, you have to use `127.0.0.1`.

7. Cancel the command to close the connection.

### Troubleshooting template files

To review the output from the pipeline template file before pushing changes to OpenShift:

```bash
# "-o <format>" will set the output format.
# valid values: "yaml" | "json"
oc process -f openshift/templates/jenkins/generic-pipeline.yaml --param-file=[.env] -o yaml
```

Should output something like:

```yaml
apiVersion: v1
items:
- apiVersion: build.openshift.io/v1
  kind: BuildConfig
  metadata:
    labels:
      name: cicd-pipeline
      role: pipeline
    name: cicd-pipeline
  spec:
    output: {}
    postCommit: {}
    resources: {}
    runPolicy: Parallel
    source:
      git:
        ref: dev
        uri: https://github.com/bcgov/PIMS.git
      type: Git
    strategy:
      jenkinsPipelineStrategy:
        jenkinsfilePath: openshift/jenkins/Jenkinsfile.cicd
      type: JenkinsPipeline
    triggers:
    - github:
        secret: *****
      type: GitHub
    - generic:
        secret: *****
      type: Generic
  status:
    lastVersion: 0
kind: List
metadata: {}
```
