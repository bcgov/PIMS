# PIMS Express API

This service runs using Node and Express. Additional information on the service can be found on the [Express API Wiki page](https://github.com/bcgov/PIMS/wiki/Express-API).

## Backend Environment Variables

The backend uses a `.env` located in the project root folder. This `.env` is shared with the frontend and any Docker commands.

Recommended values used with this API that match with the current API and Docker options are shown below.

| Key                | Default Value | Description                                        |
| ---                | ---           | ---                                                |
| API_HTTP_PORT      | 5000          | API port used during local development.            |
| APP_HTTP_PORT      | 3000          | Frontend port where application is served.         |
| FRONTEND_URL       | undefined     | The URL of the frontend component. Used with CORS. Only needed in non-local deployments. |
| TESTING            | undefined     | Used to as a feature switch for testing. Set to `true` to activate. |

## Commands

These commands are specific to the `/express-api` folder. For additional commands involving other components or Docker containers, see the Makefile available in the project root.

The available commands for the backend are as follows:

| Command                    | Description                                                              |
| -------------------------- | ------------------------------------------------------------------------ |
| `npm run dev`              | Runs app in development mode.                                            |
| `npm run build`            | Builds the app into runnable JavaScript.                                               |

## Usage

With the Express API running, use a tool such as [Thunder Client](https://www.thunderclient.com/) or [Postman](https://www.postman.com/) to send HTTP requests to available endpoints.

These endpoints will be available on a Swagger page that will also offer the ability to test endpoints.
