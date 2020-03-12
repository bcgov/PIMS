# Secret Management in OpenShift

In order to keep private keys and other sensitive information out of source control, this project uses **secrets**.

Within OpenShift Container Platform, **secrets** provide a mechanism to hold sensitive information such as passwords, sensitive configuration files, private source repository credentials, and so on. To learn more about OpenShift secrets, click [here](https://docs.openshift.com/container-platform/3.11/dev_guide/secrets.html#secrets-examples).

# Before you start

* Set `${namespace*}` to match the OpenShift project namespaces you have been assigned in the cluster (Eg, **jcxjin** for PIMS)

```bash
# tools, dev, test & prod
export namespace_tools=jcxjin-tools

export namespace_dev=jcxjin-dev

export namespace_test=jcxjin-test

export namespace_prod=jcxjin-prod
```

# 1 Create Secret for Database Credentials

* You will need to create secrets for **each** OpenShift environment available to you, Eg, [dev, test, prod].

* Set **`ENV_NAME=[dev|test|prod]`** below to match the environment you are configuring. 
  * Remember to target the right namespace!

```bash
cd openshift/templates/app/secrets

oc project $namespace_dev
oc process -f database-secrets.yaml -p ENV_NAME=dev | oc create -f -

oc project $namespace_test
oc process -f database-secrets.yaml -p ENV_NAME=test | oc create -f -

oc project $namespace_prod
oc process -f database-secrets.yaml -p ENV_NAME=prod | oc create -f -
```

# 2 Create Secrets for Keycloak SSO Credentials

### Backend API Credentials

* **KEYCLOAK_AUTHORITY** is Keycloak SSO bearer authority, used by the API server. 
  * Eg, https://sso-dev.pathfinder.gov.bc.ca/auth/realms/[realm-name]/

```bash
cd openshift/templates/app/secrets

oc project $namespace_dev
oc process -f api-secrets.yaml \
  -p ENV_NAME=dev \
  -p KEYCLOAK_AUTHORITY=[sso-dev realm URL] \
  | oc create -f -

oc project $namespace_test
oc process -f api-secrets.yaml \
  -p ENV_NAME=test \
  -p KEYCLOAK_AUTHORITY=[sso-test realm URL] \
  | oc create -f -

oc project $namespace_prod
oc process -f api-secrets.yaml \
  -p ENV_NAME=prod \
  -p KEYCLOAK_AUTHORITY=[sso-production realm URL] \
  | oc create -f -
```

### Frontend Login Credentials

* **KEYCLOAK_SSO_HOST** is Keycloak SSO public client authentication URL, used by the frontend login. 
  * Eg, https://sso-dev.pathfinder.gov.bc.ca/auth

```bash
cd openshift/templates/app/secrets

oc project $namespace_dev
oc process -f app-secrets.yaml \
  -p ENV_NAME=dev \
  -p KEYCLOAK_SSO_HOST=[sso-dev host] \
  | oc create -f -

oc project $namespace_test
oc process -f app-secrets.yaml \
  -p ENV_NAME=test \
  -p KEYCLOAK_SSO_HOST=[sso-test host] \
  | oc create -f -

oc project $namespace_prod
oc process -f app-secrets.yaml \
  -p ENV_NAME=prod \
  -p KEYCLOAK_SSO_HOST=[sso-production host] \
  | oc create -f -
```
