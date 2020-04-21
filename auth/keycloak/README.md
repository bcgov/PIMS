# Keycloak Information

- [Docker](https://hub.docker.com/r/jboss/keycloak/)
- [Github](https://github.com/keycloak/keycloak-containers/tree/master/server)

## Export Realm Configuration
After configuring Keycloak you can export the configuration to a JSON file so that it can be used to initialize a new Keycloak instance.
If you use the UI to export it will not contain all the necessary information and settings, thus the need for this CLI option.

More information [here](https://www.keycloak.org/docs/latest/server_admin/index.html#_export_import).

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
$ docker exec -it keycloak bash
$ /opt/jboss/keycloak/bin/standalone.sh \
  -Dkeycloak.migration.action=export \
  -Dkeycloak.migration.provider=singleFile \
  -Dkeycloak.migration.file=/tmp/realm-export-new.json \
  -Dkeycloak.migration.usersExportStrategy=REALM_FILE \
  -Dkeycloak.migration.strategy=OVERWRITE_EXISTING \
  -Djboss.http.port=8888 \
  -Djboss.https.port=9999 \
  -Djboss.management.http.port=7777
```

Or (this doens't appear to work on Windows)

```bash
$ docker exec -it keycloak bash /opt/jboss/keycloak/bin/standalone.sh \
  -Djboss.socket.binding.port-offset=100 \
  -Dkeycloak.migration.action=export \
  -Dkeycloak.migration.provider=singleFile \
  -Dkeycloak.migration.strategy=OVERWRITE_EXISTING \
  -Dkeycloak.migration.realmName=pims \
  -Dkeycloak.migration.usersExportStrategy=REALM_FILE \
  -Dkeycloak.migration.file=/tmp/realm-export-new.json
```

## Import Realm
> Note that some attempts to import the exported JSON during initialization results in failure with the latest exported JSON.
However if you start the keycloak server without importing and then manually do the import below, it works.

To import a previously exported realm configuration execute the following command;

```bash
$ docker exec -it keycloak bash
$ /opt/jboss/keycloak/bin/standalone.sh \
  -Djboss.socket.binding.port-offset=100 \
  -Dkeycloak.migration.action=import \
  -Dkeycloak.profile.feature.scripts=enabled \
  -Dkeycloak.profile.feature.upload_scripts=enabled \
  -Dkeycloak.migration.provider=singleFile \
  -Dkeycloak.migration.file=/tmp/realm-export.json
```

or

```bash
$ docker run -e KEYCLOAK_USER=<USERNAME> -e KEYCLOAK_PASSWORD=<PASSWORD> \
    -e KEYCLOAK_IMPORT=/tmp/example-realm.json -v /tmp/example-realm.json:/tmp/example-realm.json jboss/keycloak
```
