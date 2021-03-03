# Jenkins

PIMS uses Jenkins to automate the deployment pipelines

## Service Account

The service account Jenkins will use needs to be created and referenced in each namespace it will have access to.

- Login with the `oc`

```bash
cd openshift/4.0/templates/jenkins
oc process -f rolebinding.yaml | oc create --save-config=true -f -
```

## How to deploy Jenkins Master

We deploy the Jenkins Master using the [jenkins-master.yaml](./jenkins-master.yaml)

- (Optional) Create a `.env` file with the following.

```conf
APP_NAME=jenkins
PROJECT_NAME=354028-tools
ENV_NAME=tools
NAMESPACE=354028
DOMAIN=apps.silver.devops.gov.bc.ca
```

- Run the following the `oc` command to create Jenkins pod

```bash
oc process jenkins-slave.yaml | oc apply -f -
#  if customising the deployment using the .env file
oc process jenkins-slave.yaml --param-file=.env | oc apply -f -
```

## Configure the DEV CI/CD Pipeline

Jenkins is being used to orchestrate jobs between GitHub and OpenShift. Anytime a Pull Request is opened against the dev/master branch, it triggers a job on Jenkins which runs the pipeline stages and reports the status back to GitHub.

This project makes use of several pipelines. For each one, use the generic pipeline template located at `openshift/4.0/templates/jenkins/generic-pipeline.yaml` and customize with appropriate values.

### 1 cicd-pipeline

1. View the parameters `oc process --parameters -f openshift/4.0/templates/jenkins/generic-pipeline.yaml`
2. Create a **`.env`** file that contains the values for the parameters within the template
   ```
   NAME=cicd
   JENKINSFILE_PATH=openshift/4.0/pipelines/Jenkinsfile.cicd
   ```
3. Create the pipeline objects `oc process --param-file=[.env] -f openshift/4.0/templates/jenkins/generic-pipeline.yaml | oc create -f -`

### 2 dev-to-test-pipeline

1. View the parameters `oc process --parameters -f openshift/4.0/templates/jenkins/generic-pipeline.yaml`

2. Create a **`.env`** file that contains the values for the parameters within the template

   ```
   NAME=promote-to-test
   JENKINSFILE_PATH=openshift/4.0/pipelines/Jenkinsfile.promote-to-test
   ```

3. Create the pipeline objects `oc process --param-file=[.env] -f openshift/4.0/templates/jenkins/generic-pipeline.yaml | oc create -f -`

### 3 dev-alpha-pipeline

The dev alpha pipeline is used to test unreleased features that may not have a complete implementation or includes a design that is not ready to be included in the regular PIMS release lifecycle. The alpha pipeline allows developers to share these kinds of changes with other developers and non-technical users in a similar manner to the core PIMS git flow, but using the dev-alpha branch instead of the regular dev branch. Note that the dev-alpha-pipeline uses the original Jenkinsfile.cicd configuration.

1. View the parameters `oc process --parameters -f openshift/4.0/templates/jenkins/generic-pipeline.yaml`

2. Create a **`.env`** file that contains the values for the parameters within the template

   ```
   APP_NAME=pims-alpha
   ```

3. Create the pipeline objects `oc process --param-file=[.env] -f openshift/4.0/templates/jenkins/generic-pipeline.yaml | oc create -f -`

### 4 dev-test-pipeline

1. View the parameters `oc process --parameters -f openshift/4.0/templates/jenkins/generic-pipeline.yaml`

2. Create a **`.env`** file that contains the values for the parameters within the template

   ```
   NAME=dev-test

   JENKINSFILE_PATH=openshift/4.0/pipelines/Jenkinsfile.dev-to-test
   ```

3. Create the pipeline objects `oc process --param-file=[.env] -f openshift/4.0/templates/jenkins/generic-pipeline.yaml | oc create -f -`

### 5 push-to-prod-pipeline

1. View the parameters `oc process --parameters -f openshift/4.0/templates/jenkins/generic-pipeline.yaml`

2. Create a **`.env`** file that contains the values for the parameters within the template

   ```
   NAME=push-to-prod
   JENKINSFILE_PATH=openshift/4.0/pipelines/Jenkinsfile.dev-to-test
   OC_JOB_NAME=master
   ENV_NAME=prod
   ENABLE_VERSION_PROMPT=true
   VANITY_URL=https://pims.gov.bc.ca/
   ```

3. Create the pipeline objects `oc process --param-file=[.env] -f openshift/4.0/templates/jenkins/generic-pipeline.yaml | oc create -f -`

### 6 master-pipeline

1. View the parameters `oc process --parameters -f openshift/4.0/templates/jenkins/generic-pipeline.yaml`

2. Create a **`.env`** file that contains the values for the parameters within the template

   ```
   NAME=master
   JENKINSFILE_PATH=openshift/4.0/pipelines/Jenkinsfile.dev-to-test
   OC_JOB_NAME=master
   ENV_NAME=prod
   ENABLE_VERSION_PROMPT=true
   VANITY_URL=https://pims.gov.bc.ca/
   ```

3. Create the pipeline objects `oc process --param-file=[.env] -f openshift/4.0/templates/jenkins/generic-pipeline.yaml | oc create -f -`
