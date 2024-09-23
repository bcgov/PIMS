# PIMS React APP

This service runs using Node and is built using the Vite development environment and the React framework.

It displays the UI for the PIMS application.

Additional information on the service can be found on the [React App Wiki page](https://github.com/bcgov/PIMS/wiki/React-App).

## Commands

These commands are specific to the `/react-app` folder.

The available commands for the frontend are shown below.
Every command should be prefixed with `npm run`. (e.g. `npm run dev`)

| Command     | Description                                                                               |
| ----------- | ----------------------------------------------------------------------------------------- |
| `dev`       | Runs app in development mode.                                                             |
| `build`     | Builds the app into runnable JavaScript, located in the `/dist` folder.                   |
| `lint`      | Identifies linting errors from `eslint` and `prettier` packages.                          |
| `lint:fix`  | Fixes found linting errors where possible.                                                |
| `check`     | Identifies linting errors from the `prettier` package. Use `lint` instead.                |
| `format`    | Only fixes errors found by `prettier`. Use `lint:fix` instead.                            |
| `test`      | Runs all test cases.                                                                      |
| `snapshots` | Runs all test cases. Snapshot tests that do not match existing snapshots will be updated. |

## Usage

With the application running, either in development mode or in a Docker container, visit the URL where it is being exposed. By default, this is [http://localhost:3000](http://localhost:3000).
