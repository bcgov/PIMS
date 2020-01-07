# Keycloak Information

https://hub.docker.com/r/jboss/keycloak/

## Export Realm Configuration

https://www.keycloak.org/docs/latest/server_admin/index.html#_export_import
Once the keycloak container is running, ssh into it and execute the following commands;

```
cd keycloak
bin/standalone.sh -Dkeycloak.migration.action=export -Dkeycloak.migration.provider=singleFile -Dkeycloak.migration.file=/tmp/realm-export-new.json -Dkeycloak.migration.usersExportStrategy=REALM_FILE -Dkeycloak.migration.strategy=OVERWRITE_EXISTING -Djboss.http.port=8888 -Djboss.https.port=9999 -Djboss.management.http.port=7777
```
