# PIMS Sonarqube server

PIMS uses sonarqube for static analysis and for live vulnerability testing on the deployed pims DEV instance. This Readme covers the Openshift setup of the server component of SonarQube. For instructions on how to use the scanner portion, see the Pipeline documentation.

In OCP 4.0 the sonarqube image and the postgresql image is no longer maintained by the devexchange devops group, so you'll need the following:

```
oc new-build https://github.com/BCDevOps/sonarqube --strategy=docker --name=sonarqube --to=sonarqube:8.2
oc import-image rhel8/postgresql-96 --from=registry.redhat.io/rhel8/postgresql-96 --confirm
```

Go to - `/pims/openshift/4.0/templates/sonarqube`

## Build Configuration

Validate that all parameters included in the sonarqube-postgresql-template.yaml are correct for the application.
Given that Sonarqube installation should only be necessary in the tools namespace, modifications to the template should not be necessary.
Note that the template creates all required builds, secrets, deployments, volumes, nsp, services and routes.

Create the database build and save the template.

```bash
oc project 354028-tools

oc process -f sonarqube-postgresql-template.yaml | oc create --save-config=true -f -
```

## Usage

Validate that Sonarqube and Sonarqube DB builds and deploys successfully. Once the Sonarqube pod has finished startup, you should be able to navigate to sonarqube via the route. By default, authentication is not required to view the reports. Initially, there will be no Projects, these should be added automatically by the PIMS build pipeline after a successful execution.
