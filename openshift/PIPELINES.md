# Configure the CI/CD Pipeline

Jenkins is being used to orchestrate jobs between GitHub and OpenShift. Anytime a Pull Request is opened against the dev/master branch, it triggers a job on Jenkins which runs the pipeline stages and reports the status back to GitHub.

This project makes use of several pipelines. For each one, use the generic pipeline template located at `openshift/templates/jenkins/generic-pipeline.yaml` and customize with appropriate values.

## 3.1 cicd-pipeline

1. View the parameters `oc process --parameters -f openshift/templates/jenkins/generic-pipeline.yaml`
2. Create a **`.env`** file that contains the values for the parameters within the template
   ```
   NAME=cicd
   JENKINSFILE_PATH=openshift/pipelines/Jenkinsfile.cicd
   ```
3. Create the pipeline objects `oc process --param-file=[.env] -f openshift/templates/jenkins/generic-pipeline.yaml | oc create -f -`

## 3.2 promote-to-test-pipeline

1. View the parameters `oc process --parameters -f openshift/templates/jenkins/generic-pipeline.yaml`

2. Create a **`.env`** file that contains the values for the parameters within the template

   ```
   NAME=promote-to-test
   JENKINSFILE_PATH=openshift/pipelines/Jenkinsfile.promote-to-test
   ```

3. Create the pipeline objects `oc process --param-file=[.env] -f openshift/templates/jenkins/generic-pipeline.yaml | oc create -f -`
