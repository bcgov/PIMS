# OpenShift environment configuration

This project uses OpenShift container platform (v3.11) for hosting the application and deploying/running any services required by it.

# Setup

## Templates

To configure OpenShift environments first create Templates. Then create the Objects from the Templates.
1 Login `oc login`
2 Select the appropriate Project `oc project [name]`

### PIMS API Build

1 `oc create -f openshift/templates/app/pims-api/build.yaml`
2 View the parameters `oc process --parameters pims-api-build`
3 Create a build.env file that contains the values for the parameters within the template
4 Create Objects `oc process pims-api-build --param-file=[.env] | oc create -f -`

### PIMS API Deploy

1 `oc create -f openshift/templates/app/pims-api/deploy.yaml`
2 View the parameters `oc process --parameters pims-api-deploy`
3 Create a deploy.env file that contains the values for the parameters within the template
4 Create Objects `oc process pims-api-deploy --param-file=[.env] | oc create -f -`

# Environments

There are 4 environments setup in the OpenShift Platform.

- Tools : Contains all the tools/external services required by the application.
- Dev : Contains a running application instance of an open pull request branch.
- Test : Contains a running application instance of the current release branch.
- Prod : Contains a running application instance of the current state of master.

# Filename Convention

Files are named with the following convention in mind:

- [APPLICATION]-build.yaml: Build configuration for the application. Used for building any images required by the deployment configuration.

- [APPLICATION]-deploy.json: Deployment configuration for the application. These deployment pods are long lived.

# CI/CD Tools

## Jenkins

Jenkins is being used to orchestrate jobs between Github and OpenShift. Anytime a PR is open against the release/master branch it triggers a job on Jenkins which runs the pipeline stages and reports the status back to Github.

[Link to Documentation](https://docs.openshift.com/container-platform/3.10/using_images/other_images/jenkins.html)

[Link to the jenkins s2i image](https://github.com/BCDevOps/openshift-components/tree/master/cicd/jenkins)

## SonarQube

SonarQube is being used to ensure code quality and test coverage is up to date.

[Link to Documentation](https://docs.sonarqube.org/display/SONAR/Documentation)

## ZAP

OWASP ZAP is being used to check for network penetration and find security vulnerabilities.

[Link to Documentation](https://www.owasp.org/index.php/OWASP_Zed_Attack_Proxy_Project)

# Application Components

### Nodejs 10

The app uses a Nodejs (v10) runtime environment to run the frontend.

[Link to s2i image](https://github.com/sclorg/s2i-nodejs-container/tree/master/10)

### .NET Core 3.1

The app uses a .NET Core (v3.1) environment to create a REST API that handles interaction between the frontend and the database.

[Link to s2i image](https://github.com/redhat-developer/s2i-dotnetcore/tree/master/3.1/build)

### Postgres

The app uses a PostgresSQL database to store and retrieve data from.

[Link to image](https://github.com/sclorg/postgresql-container/tree/generated/10)
