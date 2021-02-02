# Monitor Performance

Grafana and Prometheus are setup to monitor the performance.

## Prometheus

Go to - `/pims/openshift/4.0/templates/monitor`

Create a deployment configuration file here - `deploy-prometheus.env`
Update the configuration file and set the appropriate parameters.

**Example**

```conf
APP_NAME=prometheus
PROMETHEUS_DOMAIN=pims-prometheus.apps.silver.devops.gov.bc.ca
PIMS_DEV_API_URL=pims-dev.apps.silver.devops.gov.bc.ca
PIMS_TEST_API_URL=pims-test.apps.silver.devops.gov.bc.ca
PIMS_PROD_API_URL=pims.gov.bc.ca
```

Create the api build and save the template.

```bash
oc project 354028-tools
oc process -f deploy-prometheus.yaml --param-file=deploy-prometheus.env | oc create --save-config=true -f -
```

Once the pod is up you can test by going to the url [pims-prometheus.apps.silver.devops.gov.bc.ca](https://pims-prometheus.apps.silver.devops.gov.bc.ca).

## Grafana

Go to - `/pims/openshift/4.0/templates/monitor`

Create a deployment configuration file here - `deploy-grafana.env`
Update the configuration file and set the appropriate parameters.

**Example**

```conf
APP_NAME=grafana
GRAFANA_DOMAIN=pims-grafana.apps.silver.devops.gov.bc.ca
PROMETHEUS_URL=https://pims-prometheus.apps.silver.devops.gov.bc.ca
```

Create the api build and save the template.

```bash
oc project 354028-tools
oc process -f deploy-grafana.yaml --param-file=deploy-grafana.env | oc create --save-config=true -f -
```

Once the pod is up you can test by going to the url [pims-grafana.apps.silver.devops.gov.bc.ca](https://pims-grafana.apps.silver.devops.gov.bc.ca) and logging in with your GitHub account.
