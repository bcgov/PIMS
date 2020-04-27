# Postman

Postman is a collaboration platform for API development.
Postman's features simplify each step of building an API and streamline collaboration so you can create better APIs—faster.

> [Home Page](https://www.postman.com/)

## PIMS Collection

Included in this repo is the **PIMS Collection**.
This JSON file can be imported into your local Postman application and you can run tests against the API.

## Environment Configuration

You will need to add an environment in Postman with the following parameters to run it against your local containers.

```conf
scheme=http
host=localhost
port=5000
realm=pims
access-token=
row-version=
keycloak-scheme=http
keycloak-host=keycloak
keycloak-port=8080
pims-service-account-secret=
pims-test-secret=
pims-test-username=
pims-test-password=
```

| Key                         | Default   | Note                                                             |
| --------------------------- | --------- | ---------------------------------------------------------------- |
| scheme                      | http      | The scheme for the API.                                          |
| host                        | localhost | The host for the API.                                            |
| port                        | 5000      | The port for the API.                                            |
| realm                       | pims      | The keycloak realm.                                              |
| access-token                |           | This will be automatically populated when authentication occurs. |
| row-version                 |           | This will be automatically populated when an add/update occurs.  |
| keycloak-scheme             | http      | The scheme for keycloak.                                         |
| keycloak-host               | keycloak  | The host for keycloak.                                           |
| keycloak-port               | 8080      | The port for keycloak.                                           |
| pims-service-account-secret |           | The pims-service-account client secret.                          |
| pims-test-secret            |           | The pims-test client secret.                                     |
| pims-test-username          |           | A valid pims-test client username.                               |
| pims-test-password          |           | The password for the pims-test-username.                         |

## Usage

There are four primary folders within the collection;

- unauthenticated - requests that do not require authentication
- keycloak - direct requests to keycloak
- authenticated = requests that require authentication
- webooks - webook integration testing

### Authentication

Most endpoints require authentication.
Which means they need a valid Authorization Bearer Token.
You can get one of these through the `PIMS/keycloak/connect/token: service-account` or `PIMS/keycloak/connect/token: test` requests.
Once you receive a successful response any future requests will use the token received.

### Activation

Many endpoints require that the current user be activated.
Activated means that they have been synced with both PIMS and Keycloak.
You can **activate** a user by first getting a valid Authorization Bearer Token (above).
Then making a request with the `PIMS/authenticated/auth/activate` request.
