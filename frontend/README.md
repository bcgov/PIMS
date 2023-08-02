# PIMS Frontend Application - React

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Frontend Environment Variables

Create a .env file and populate it with this.

```conf
NODE_ENV=development
API_URL=http://backend:8080/
CHOKIDAR_USEPOLLING=true
GENERATE_SOURCEMAP=false
```

| Key                  | Value                     | Description                                        |
| ---------------------| ------------------------- | -------------------------------------------------- |
| NODE_ENV             | [development\|production] | Node.js environment setting.                       |
| API_URL              |  http://backend:8080/     | The API root URL; do not include "/api"            |
| CHOKIDAR_USEPOLLING  | [true\|false]             | Whether to use polling; set to true for containers.|

## Usage

### Commands

The available commands are as follows.

| Command                    | Description                                                              |
| -------------------------- | ------------------------------------------------------------------------ |
| npm start                  | Runs app in development mode. Preferred to use root level Make commands. |
| npm test                   | Runs frontend test suites.                                               |
| npm test -- -u             | Runs frontend test suites and updates snapshots.                         |
| npm run lint               | Runs the linter.                                                         |
| npm run build              | Builds app for production (legacy using react-scripts).                  |
| npm run build-ocp          | Builds app for production (new using vite).                              |
| npm run cypress:open       | Opens Cypress testing dashboard.                                         |
| npm run cypress:e2e        | Runs Cypress End to End test suites.                                     |

### `npm start`

Runs the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).
