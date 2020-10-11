# Keycloak

Open Source Identity and Access Management for Modern Applications and Services.

Add authentication to applications and secure services with minimum fuss. No need to deal with storing users or authenticating users. It's all available out of the box.

You'll even get advanced features such as User Federation, Identity Brokering and Social Login.

- [Keycloak](https://www.keycloak.org/)
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
  -Dkeycloak.migration.realmName=pims \
  -Dkeycloak.migration.file=/tmp/realm-export.json \
  -Dkeycloak.migration.usersExportStrategy=REALM_FILE \
  -Dkeycloak.migration.strategy=OVERWRITE_EXISTING \
  -Djboss.http.port=8888 \
  -Djboss.https.port=9999 \
  -Djboss.management.http.port=7777
```

Or (this doesn't appear to work on Windows)

```bash
$ docker exec -it keycloak bash /opt/jboss/keycloak/bin/standalone.sh -Djboss.socket.binding.port-offset=100 -Dkeycloak.migration.action=export -Dkeycloak.migration.provider=singleFile -Dkeycloak.migration.strategy=OVERWRITE_EXISTING -Dkeycloak.migration.realmName=pims -Dkeycloak.migration.usersExportStrategy=REALM_FILE -Dkeycloak.migration.file=/tmp/realm-export.json
```

## Import Realm

> Note that recent attempts to import the exported JSON during initialization results in failure.
> However if you start the keycloak server without importing, check if it is up and running with only the **master** realm and then manually do the import below, it works.
> Refer to the [Manual Steps](#manual-steps)

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

### Manual Steps

Note that the import script has hardcoded passwords, which will override whatever password you have in your `.env`.

> user: keycloak, pwd: password

1. Stop Keycloak `$ docker-compose stop keycloak keycloak-db`
2. Remove containers `$ docker rm keycloak` and `$ docker rm keycloak-db`
3. Remove volume `$ docker volume rm pims_keycloak-db-data`
4. Build Keycloak `$ docker-compose build keycloak`
5. Make sure your `.env` comments out this line `# KEYCLOAK_IMPORT=/tmp/realm-export.json`
6. Start Keycloak `$ docker-compose up -d keycloak`
7. Open Keycloak in your browser http://keycloak:8080, verify the `master` realm is there. **It will take a minute to initialize.**
8. Bash into the Keycloak docker container `$ docker exec -it keycloak bash`
9. Run the import standalone.sh script **above**. It will hang on this line - `18:30:37,822 WARN [org.keycloak.common.Profile] (ServerService Thread Pool -- 68) Preview feature enabled: scripts`. **Let it run for a minute.**
10. Press `ctrl+c` and exit the `bash`
11. Restart Keycloak `$ docker-compose restart keycloak`
12. Open Keycloak in your browser http://keycloak:8080, verify the `pims` ream is there. **It will take a minute to initialize.**
