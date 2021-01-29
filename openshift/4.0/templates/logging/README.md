# Monitor Logs

Kibana and Elasticsearch are setup to monitor log files.

## Elasticsearch

Go to - `/pims/openshift/4.0/templates/logging`

Create a deployment configuration file here - `deploy-elasticsearch.env`
Update the configuration file and set the appropriate parameters.

**Example**

```conf
ELASTICSEARCH_DOMAIN=pims-elastic.apps.silver.devops.gov.bc.ca
ELASTIC_PASSWORD={SECRET}
```

Create the api build and save the template.

```bash
oc project 354028-tools
oc process -f deploy-elasticsearch.yaml --param-file=deploy-elasticsearch.env | oc create --save-config=true -f -
```

Once the pod is up you can test by going to the url [pims-elastic.apps.silver.devops.gov.bc.ca](https://pims-elastic.apps.silver.devops.gov.bc.ca) and entering the username `elastic` and password you configured.

## Kibana

Go to - `/pims/openshift/4.0/templates/logging`

Create a deployment configuration file here - `deploy-kibana.env`
Update the configuration file and set the appropriate parameters.

**Example**

```conf
ELASTICSEARCH_NAME=elasticsearch
KIBANA_DOMAIN=pims-kibana.apps.silver.devops.gov.bc.ca
```

Create the api build and save the template.

```bash
oc project 354028-tools
oc process -f deploy-kibana.yaml --param-file=deploy-kibana.env | oc create --save-config=true -f -
```

Once the pod is up you can test by going to the url [pims-kibana.apps.silver.devops.gov.bc.ca](https://pims-kibana.apps.silver.devops.gov.bc.ca) and entering the username `elastic` and password you configured for elasticsearch.
