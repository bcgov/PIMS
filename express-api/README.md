# PIMS Express API

This service runs using Node and Express. Additional information on the service can be found on the [Express API Wiki page](https://github.com/bcgov/PIMS/wiki/Express-API).

## Backend Environment Variables

The backend uses a `.env` located in the project root folder. This `.env` is shared with the frontend and any Docker commands.

Recommended values used with this API that match with the current API and Docker options are shown below.

| Key                | Example | Description                                        |
| ---                | ---           | ---                                                |
| API_HTTP_PORT      | 5000          | API port used during local development.            |
| FRONTEND_URL       | https://...     | The URL of the frontend component. Used with CORS and Keycloak integration. |
|BACKEND_URL| https://... |Used with Keycloak integration.|
|POSTGRES_USER|username|The Postgres user account name. Not the admin account.|
|POSTGRES_PASSWORD|password|The password used with the POSTGRES_USER.|
|POSTGRES_DB|dbname|The name of the database in Postgres.|
|POSTGRES_PORT|5432|The port Postgres is listening on.|
|POSTGRES_SERVICE|postgres|The name of the postgres container if used. Defaults to localhost when the API is not containerized.|
|SSO_CLIENT_ID|abc123|The client ID from the Keycloak integration.|
|SSO_CLIENT_SECRET|def456|The client secret provided from the Keycloak integration.|
|SSO_AUTH_SERVER_URL|https://...|URL to reach Keycloak auth server. Example is for dev URL.|
|SSO_INTEGRATION_ID|1234|See Keycloak integration. Used for CSS API.|
|SSO_ENVIRONMENT|dev|Target environment of Keycloak integration. Used for CSS API.|
|GEOCODER_KEY|abc123|API key for BC Geocoder use.|
|CHES_USERNAME|abc123|Username for CHES service.|
|CHES_PASSWORD|def456|Password for CHES service.|
|CHES_AUTH_URL|https://...|URL where authorization tokens for CHES are obtained.|
|CHES_HOST_URL|https://...|URL where CHES API is reached.|
|CHES_EMAIL_ENABLED|true|Boolean value that enables/disables CHES service calls.|
|CHES_ALWAYS_BCC|<email@gov.bc.ca>|Emails that will be included in BCC field of every email. Semicolon separated.|
|CHES_DEFAULT_FROM|Sender Name <email@gov.bc.ca>|Email used as the sender for CHES notifications when not specified in service call.|
|CHES_BCC_USER|true|If true, CHES_ALWAYS_BCC addresses are included in all emails. |
|CHES_OVERRIDE_TO|<email@gov.bc.ca>|Email address that overrides any *To* field on CHES requests. Used for non-prod environments.|
|CHES_SECONDS_TO_DELAY|1000|Number of seconds to delay before email is actually sent via CHES.|
|LTSA_AUTH_URL|https://...|URL where LTSA tokens are retrieved from.|
|LTSA_HOST_URL|https://...|URL where LTSA API calls are made to.|
|LTSA_INTEGRATOR_USERNAME|username|The username used to obtain tokens from LTSA_AUTH_URL.|
|LTSA_INTEGRATOR_PASSWORD|password|The password used to obtain tokens from LTSA_AUTH_URL.|
|LTSA_USERNAME|username|The username used to make calls to the API at LTSA_HOST_URL.|
|LTSA_PASSWORD|password|The password used to make calls to the API at LTSA_HOST_URL.|

## Commands

These commands are specific to the `/express-api` folder. For additional commands involving other components or Docker containers, see the Makefile available in the project root.

The available commands for the backend are shown below.
Every command should be prefixed with `npm run`. (e.g. `npm run dev`)

| Command                    | Description                                                              |
| -------------------------- | ------------------------------------------------------------------------ |
| `dev`              | Runs app in development mode using nodemon and ts-node.                                            |
| `build`            | Builds the app into runnable JavaScript.                                               |
|`lint`|Identifies linting errors from `eslint` and `prettier` packages.|
|`lint:fix`|Fixes found linting errors where possible.|
|`check`|Identifies linting errors from the `prettier` package. Use `lint` instead.|
|`format`|Only fixes errors found by `prettier`. Use `lint:fix` instead.|
|`test`|Runs all test cases and generates coverage reports.|
|`test:unit`|Only runs unit tests.|
|`test:integration`|Only runs integration tests.|
|`swagger`|Re-generates Swagger documentation.|
|`typeorm`|Accesses the TypeORM CLI. Use this with other TypeORM commands.|
|`migration`|Runs the migrations control script. See the wiki for more information.|

## Usage

With the Express API running, use a tool such as [Thunder Client](https://www.thunderclient.com/) or [Postman](https://www.postman.com/) to send HTTP requests to available endpoints.

These endpoints are available on a Swagger page that will also offer the ability to test endpoints. If running locally, see the /api-docs route. (e.g. localhost:5000/api-docs/)
