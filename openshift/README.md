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

| Object                    | Description                                                                                                     |
| ------------------------- | --------------------------------------------------------------------------------------------------------------- |
| [APPLICATION]-build.yaml  | Build configuration for the application. Used for building any images required by the deployment configuration. |
| [APPLICATION]-deploy.yaml | Deployment configuration for the application. These deployment pods are long lived.                             |

# Getting Started

Follow the instructions below to setup all the components required to run PIMS in Openshift.

## 1. Import Base Images

### Import image `nodejs-10-rhel7:1-30` from Red Hat

This image will be used by the frontend build. As with other base images it should be configured in your **Tools** environment. At the time of writing, PIMS is using **nodejs-10-rhel7:1-30**

Use the following instructions to get images from a Red Hat container registry using registry service account tokens. You will need to [create a registry service account](https://access.redhat.com/terms-based-registry/) to use prior to completing any of the following tasks.

#### Using OpenShift secrets

First, you will need to add a reference to the appropriate secret and repository to your Kubernetes pod configuration via an imagePullSecrets field. For additional information go [here](https://docs.openshift.com/container-platform/3.11/dev_guide/managing_images.html#using-image-pull-secrets) and [here](https://access.redhat.com/solutions/4177741).

_You only need to do this once - all subsequent imports from registry.redhat.io will use the secret_

```bash
apiVersion: v1
kind: Pod
metadata:
  name: {POD-NAME}
  namespace: {TARGET-NAMESPACE or all}
  spec:
    containers:
      - name: web
        image: registry.redhat.io/rhscl/nodejs-10-rhel7

    imagePullSecrets:
      - name: {PULL-SECRET-NAME}
```

Then, use the following from the command line or from the OpenShift Dashboard GUI interface.

```bash
oc import-image rhscl/nodejs-10-rhel7:1-30 --from=registry.redhat.io/rhscl/nodejs-10-rhel7:1-30 --confirm
```

## 2. Use Templates To Generate OpenShift Objects

To configure OpenShift environments first create Templates. Then create the Objects from the Templates.

1. Login `oc login`
2. Select the appropriate Project `oc project [name]`

### 2.1 Frontend Application

The front-end application is a React app. It is hosted by Nginx and the React app is built for a production release. It is developed with TypeScript to improve standards. It uses Keycloak for authentication. The JWT token will contain authorization information and allows for communication with the API.

##### _Build Configuration for Frontend_

1. `oc create -f openshift/templates/pims-app/build.yaml`
2. View the parameters `oc process --parameters pims-api-build`
3. Create a `.env` file that contains the values for the parameters within the template
4. Create Objects `oc process pims-api-build --param-file=[.env] | oc create -f -`

##### _Deployment Configuration for Frontend_

1. `oc create -f openshift/templates/pims-app/deploy.yaml`
2. View the parameters `oc process --parameters pims-api-deploy`
3. Create a `.env` file that contains the values for the parameters within the template
4. Create Objects `oc process pims-api-deploy --param-file=[.env] | oc create -f -`

### 2.2 Server API

The back-end application is a .NET Core 3.1 RESTful API. It is hosted in a Linux container. It uses Keycloak for authentication and authorization. Communication to it requires a JWT Bearer token. The API connects to a Microsoft SQL database hosted in a Linux container.

##### _Build Configuration for Server API_

1. `oc create -f openshift/templates/pims-api/build.yaml`
2. View the parameters `oc process --parameters pims-api-build`
3. Create a `.env` file that contains the values for the parameters within the template
4. Create Objects `oc process pims-api-build --param-file=[.env] | oc create -f -`

##### _Deployment Configuration for Server API_

1. `oc create -f openshift/templates/pims-api/deploy.yaml`
2. View the parameters `oc process --parameters pims-api-deploy`
3. Create a `.env` file that contains the values for the parameters within the template
4. Create Objects `oc process pims-api-deploy --param-file=[.env] | oc create -f -`

# 3. Configure the CI/CD Pipeline

Jenkins is being used to orchestrate jobs between GitHub and OpenShift. Anytime a Pull Request is opened against the dev/master branch, it triggers a job on Jenkins which runs the pipeline stages and reports the status back to GitHub.

This project makes use of several pipelines. For each one, use the generic pipeline template located at `openshift/templates/tools/pipeline.yaml` and customize with appropriate values.

### 3.1 cicd-pipeline

1. View the parameters `oc process --parameters -f openshift/templates/tools/pipeline.yaml`
2. Create a **`.env`** file that contains the values for the parameters within the template
   ```
   NAME=cicd
   JENKINSFILE_PATH=openshift/pipelines/Jenkinsfile.cicd
   ```
3. Create the pipeline objects `oc process --param-file=[.env] -f openshift/templates/tools/pipeline.yaml | oc create -f -`

### 3.2 promote-to-test-pipeline

1. View the parameters `oc process --parameters -f openshift/templates/tools/pipeline.yaml`

2. Create a **`.env`** file that contains the values for the parameters within the template

   ```
   NAME=promote-to-test
   JENKINSFILE_PATH=openshift/pipelines/Jenkinsfile.promote-to-test
   ```

3. Create the pipeline objects `oc process --param-file=[.env] -f openshift/templates/tools/pipeline.yaml | oc create -f -`

### 3.3 Troubleshooting template files

To review the output from the pipeline template file before pushing changes to OpenShift:

```bash
# "-o <format>" will set the output format. Valid values are "yaml" and "json"
oc process -f openshift/templates/tools/pipeline.yaml --param-file=[.env] -o yaml
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

#### More Information Available At

[Link to OpenShift Documentation](https://docs.openshift.com/container-platform/3.10/using_images/other_images/jenkins.html)

[Link to the Jenkins s2i image](https://github.com/BCDevOps/openshift-components/tree/master/cicd/jenkins)

## 4. Configure Static Code Analysis (SonarQube)

SonarQube is being used to ensure code quality and test coverage is up to date.

[Link to Documentation](https://docs.sonarqube.org/display/SONAR/Documentation)

### 4.1 ZAP Security Scanning

OWASP ZAP is being used to check for network penetration and find security vulnerabilities.

[Link to Documentation](https://www.owasp.org/index.php/OWASP_Zed_Attack_Proxy_Project)

# Resources & Troubleshooting

## Remoting Into The Database

To make a remote connection to a container in OpenShift you will need to open a local port to the remote container.

1. From OpenShift web interface Copy Login Command from the button in the top right corner.
2. Paste the login command into bash and hit enter to log in.
3. Switch your openshift environment in bash to the one you intend to modify using the command

   > oc project jhnamn-foo.

4. Get pod ids. Find the pod name that hosts your database and you want to remote into and save it for the next step (i.e. \$PODNAME=_mssql-00-foo_).

   > oc get pods

5. Create a local port to connect your client to using the command:

   > oc port-forward $PODNAME $LOCALPORT:\$CONTAINERPORT

   \$LOCALPORT = The port you want to forward to locally.

   \$CONTAINERPORT = The port open on the container that communicates with the database.

6. Configure your client to connect to the \$LOCALPORT you have selected with the host name/ip of `127.0.0.1` (please note that _localhost_ will not work).
7. Cancel the command to close the connection.
