# PIMS Frontend Application - React

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Frontend Environment Variables

Create a .env file and populate it with this.

```conf
NODE_ENV=development
API_URL=http://backend:8080/
CHOKIDAR_USEPOLLING=true
REACT_APP_SITEMINDER_LOGOUT_URL=https://logontest.gov.bc.ca/clp-cgi/logoff.cgi or https://logon7.gov.bc.ca/clp-cgi/logoff.cgi
```

| Key                             | Value                                          | Description                                         |
| ------------------------------- | ---------------------------------------------- | --------------------------------------------------- |
| NODE_ENV                        | [development\|production]                      | Node.js environment setting.                        |
| API_URL                         | [[http://backend:8080/](http://backend:8080/)] | The API root URL; do not include "/api"             |
| CHOKIDAR_USEPOLLING             | [true\|false]                                  | Whether to use polling; set to true for containers. |
| REACT_APP_SITEMINDER_LOGOUT_URL | https://logontest.gov.bc.ca/clp-cgi/logoff.cgi | Siteminder logout URL.                              |

## Keycloak Configuration

Ensure the the following file exists and is configured with your Keycloak client settings.

```json
{
  "realm": "pims",
  "auth-server-url": "http://keycloak:8080/auth",
  "ssl-required": "external",
  "resource": "pims-app",
  "public-client": true,
  "confidential-port": 0
}
```

Make sure the host name matches both the Docker container name found in the `docker-compose.yaml` and your local host `hosts` file.
For example here it is set to `keycloak`, which means there is a `hosts` file entry for `127.0.0.1 keycloak` on your local computer and the `docker-compose.yaml` contains a `service` named `keycloak`.
This is required so that Keycloak will correctly authenticate tokens for the specified **Issuer**.

## Usage

### Commands

This project uses Make commands listed in the [Makefile](./Makefile) for ease of development. The available commands are as follows.

| Command      | Description                                                 |
| ------------ | ----------------------------------------------------------- |
| make install | Setup the development environment; install NPM dependencies |
| make build   | Builds the app for production to the `build` folder         |
| make run     | Runs the app in the development mode                        |
| make lint    | Runs the linter                                             |
| make test    | Launches the test runner in the interactive watch mode      |
| make clean   | Purges node_modules                                         |

Refer to the [Makefile](./Makefile) for arguments required for the above commands.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.

You will also see any lint errors in the console.
**Note that at time of writing react-scripts 3.3.0 has a defect that prevents ie from displaying via webpack (dev only). this is fixed with this
[link](https://github.com/facebook/create-react-app/issues/8084#issuecomment-562981098)**.

### `npm test`

Launches the test runner in the interactive watch mode.

These tests are provided for reference only and do not represent full coverage.
A reference tests for API, snapshot rendering, and DOM checking are included in AddPlaceForm.test.tsx
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
