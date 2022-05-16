# Configure the CI/CD Pipeline

Jenkins is being used to orchestrate jobs between GitHub and OpenShift. Anytime a Pull Request is opened against the dev/master branch, it triggers a job on Jenkins which runs the pipeline stages and reports the status back to GitHub.

This project makes use of several pipelines. For each one, use the generic pipeline template located at `openshift/templates/jenkins/generic-pipeline.yaml` and customize with appropriate values.

## 1 cicd-pipeline

1. View the parameters `oc process --parameters -f openshift/templates/jenkins/generic-pipeline.yaml`
2. Create a **`.env`** file that contains the values for the parameters within the template
   ```
   NAME=cicd
   JENKINSFILE_PATH=openshift/3.11/pipelines/Jenkinsfile.cicd
   ```
3. Create the pipeline objects `oc process --param-file=[.env] -f openshift/templates/jenkins/generic-pipeline.yaml | oc create -f -`

## 2 dev-to-test-pipeline

1. View the parameters `oc process --parameters -f openshift/templates/jenkins/generic-pipeline.yaml`

2. Create a **`.env`** file that contains the values for the parameters within the template

   ```
   NAME=promote-to-test
   JENKINSFILE_PATH=openshift/pipelines/Jenkinsfile.promote-to-test
   ```

3. Create the pipeline objects `oc process --param-file=[.env] -f openshift/templates/jenkins/generic-pipeline.yaml | oc create -f -`

## 2 dev-alpha-pipeline

The dev alpha pipeline is used to test unreleased features that may not have a complete implementation or includes a design that is not ready to be included in the regular PIMS release lifecycle. The alpha pipeline allows developers to share these kinds of changes with other developers and non-technical users in a similar manner to the core PIMS git flow, but using the dev-alpha branch instead of the regular dev branch. Note that the dev-alpha-pipeline uses the original Jenkinsfile.cicd configuration.

1. View the parameters `oc process --parameters -f openshift/templates/jenkins/generic-pipeline.yaml`

2. Create a **`.env`** file that contains the values for the parameters within the template

   ```
   APP_NAME=pims-alpha
   ```

3. Create the pipeline objects `oc process --param-file=[.env] -f openshift/templates/jenkins/generic-pipeline.yaml | oc create -f -`
