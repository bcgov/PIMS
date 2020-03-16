# PIMS Import Tool

The PIMS Import Tool provides a way to parse a JSON file containing an array of items and send bundled HTTP requests to a configured API endpoint for the purpose of importing data.

This console application can send any type of array of JSON objects to any API endpoint.

Use this console application to import inventory data into PIMS.

## Setup

Create a `.env` file and populate it with the following;

```
ASPNETCORE_ENVIRONMENT=Development
Keycloak__TokenUrl={URL to Keycloak token endpoint (i.e. https://sso-dev.pathfinder.gov.bc.ca/auth/realms/quartech/protocol/openid-connect/token)}
Keycloak__ClientId={Keycloak client ID (i.e. pims-service-account)}
Keycloak__ClientSecret={Keycloak client secret}
Api__ImportUrl={URL to endpoint (i.e. http://pims-dev.pathfinder.gov.bc.ca/api/tools/import/properties)}
Import__File=./Data/properties.json
```

Some of these settings have default values contained in the `appsettings.json` configuration file.

| Key                      | Required | Description                                                                                   |
| ------------------------ | :------: | --------------------------------------------------------------------------------------------- |
| Keycloak\_\_TokenUrl     |    X     | The URL to the keycloak token endpoint.                                                       |
| Keycloak\_\_Audience     |          | The Keycloak realm (default: ClientId) audience.                                              |
| Keycloak\_\_ClientId     |    X     | The Keycloak client ID.                                                                       |
| Keycloak\_\_ClientSecret |    ?     | The Keycloak client secret.  **Required if Api:AccessToken not provided.**                    |
| Api\_\_ImportUrl         |    X     | The URL to the endpoint you want to send the request to.                                      |
| Api\_\_HttpMethod        |          | HTTP Method to use in the request (default: POST).                                            |
| Api\_\_AccessToken       |          | The JWT Bearer access token to send with the request.                                         |
| Api\_\_RefreshToken      |          | The JWT Bearer refresh token to send to fetch a new access token after it expires.            |
| Import\_\_File           |    X     | The path to the JSON file to parse and iterate through. The JSON should be an array of items. |
| Import\_\_Delay          |          | The number of seconds to delay between each request (default: 0).                             |
| Import\_\_Quantity       |          | The number of items to send in each request (default: 50, max: 100)                           |

If you prefer, you can add your JSON files to the `/Data` folder and they will be ignored by **git**.

## Run

To run the application ensure the configuration files are present and the JSON package is in the correct location.

Please note that the account with which you connect with, must be **activated** before running the import.  
As the *DAL* will attempt to associate all records that are imported with this account.
Additionally the account must have the appropriate Keycloak roles (i.e. `system-administrator`) to request the API endpoint.
When using `Keycloak:ClientId=pims-service-account` you will need to do the following (use Postman);

- Get a valid JWT token for the service account
- Make a request to the `/api/auth/activate` endpoint using that token

Go to the `/backend/tools/import` folder and execute the following;

```bash
dotnet run
```

Or you can execute the compiled build directly if you have your environment variables setup.

```bash
./Pims.Tools.Import.exe
```
