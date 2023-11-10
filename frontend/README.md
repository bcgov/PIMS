# PIMS Frontend Application - React

This project runs using Vite for both developer builds and production builds.

## Frontend Environment Variables

The frontend uses a `.env` located in the project root folder. This `.env` is shared with the API and any Docker commands.

Recommended values used in the frontend that match with the current API and Docker options are shown below.

| Key                | Default Value | Description                                |
| ---                | ---           | ---                                        |
| API_HTTP_PORT      | 5000          | API port used during local development.    |
| API_PROXY_PORT     | 8080          | Proxy port for API when using NGINX.       |
| API_SERVICE_NAME   | backend       | Service name for API when containerized.   |
| APP_HTTP_PORT      | 3000          | Frontend port where application is served. |

## Usage

### Commands

These commands are specific to the `/frontend` folder. For additional commands involving other components or Docker containers, see the Makefile available in the project root.

The available commands for the frontend are as follows:

| Command                    | Description                                                              |
| -------------------------- | ------------------------------------------------------------------------ |
| `npm run dev`              | Runs app in development mode.                                            |
| `npm run build`            | Builds the app using Vite.                                               |
| `npm test`                 | Runs frontend test suites.                                               |
| `npm run coverage`         | Runs frontend test suites and creates code coverage files.               |
| `npm run coverage:changed` | Runs code coverage but only for files changed since the main branch.     |
| `npm run snapshots`        | Runs frontend test suites and updates snapshots.                         |
| `npm run lint`             | Runs the linter.                                                         |
| `npm run lint:fix`         | Runs the linter and attempts to fix issues.                              |
| `npm run check`            | Runs a code style check using Prettier.                                  |
| `npm run format`           | Runs a code style check using Prettier and attempts to fix issues.       |

### `npm run dev`

Runs the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The port number may be different depending on your settings.

The page will reload if you make edits.

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).
