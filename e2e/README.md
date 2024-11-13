# Playwright End-to-End Testing

End-to-end (e2e) testing involves testing the entire stack of the application, including the frontend (react-app), API (express-api), and database.

These tests should focus on user paths and should mimic how the user navigates the site.

## Setup

1. Run `npm i` to install dependencies.
2. Run `npx playwright install` to install Playwright browsers.
3. Create and populate a `.env` file based on the `.env-template` file.

For the `BASE_URL`, start with `localhost:<port>` for local testing.

Change BASE_URL to target other environments as needed.

## Run Tests

- `npx playwright test`: Runs tests in headless mode.
- `npx playwright test --ui`: Starts the Playwright UI.
- `npx playwright codegen <url>`: Starts the Codegen test maker. You can use this to capture movements in a browser and construct tests.
