# Keycloak Information

https://hub.docker.com/r/jboss/keycloak/

## Export Realm Configuration
After configuring Keycloak you can export the configuration to a JSON file so that it can be used to initialize a new Keycloak instance.
If you use the UI to export it will not contain all the necessary information and settings, thus the need for this CLI option.

https://www.keycloak.org/docs/latest/server_admin/index.html#_export_import
Once the keycloak container is running, ssh into it and execute the following commands;

### Find Docker Container ID
```bash
docker ps
```

### SSH into the Container
```bash
docker exec -it {ContainerID} bash
```

### Export the Configuration

```bash
cd keycloak
bin/standalone.sh -Dkeycloak.migration.action=export -Dkeycloak.migration.provider=singleFile -Dkeycloak.migration.file=/tmp/realm-export-new.json -Dkeycloak.migration.usersExportStrategy=REALM_FILE -Dkeycloak.migration.strategy=OVERWRITE_EXISTING -Djboss.http.port=8888 -Djboss.https.port=9999 -Djboss.management.http.port=7777
```
