# Configure logging

PIMS logging uses Elasticsearch to collect logs from the PIMS API, and Kibana dashboards for searching and displaying logs.

## Elasticsearch

Elasticsearch is a search engine based on the Lucene library. It provides a distributed, multitenant-capable full-text search engine with an HTTP web interface and schema-free JSON documents.

Elasticsearch is deployed in the PIMS tools in Openshift. The PIMS backend API is configured to send its logs to an Elasticsearch index based on its environment.

1. Development environment => `pims-api-dev-*`
1. Test environment => `pims-api-test-*`
1. Production environment => `pims-api-prod-*`

## Kibana

Kibana is deployed in the PIMS tools in Openshift. Kibana connects to Elasticsearch and queries the PIMS API logs and displays theme.

Visit the Kibana application [here](<https://pims-kibana.pathfinder.gov.bc.ca/app/kibana#/home?_g=()>)
