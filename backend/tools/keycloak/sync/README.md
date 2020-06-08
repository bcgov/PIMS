# Keycloak Sync Tool

The Keycloak Sync Tool provides a way to configure Keycloak so that PIMS will work correctly.
This includes creating Keycloak Roles, Groups and Clients and configuring each to have the correct settings.
The tool will align the PIMS database users, roles and claims with Keycloak objects.
Additionally any users within Keycloak will be added to PIMS.

## Setup

First login to Keycloak, create the `pims-service-account` Client and apply the appropropriate roles for this tool to work.

> Regrettably I have not discovered a way yet to authenticate without a known Client.

1. Login to Keycloak Realm
2. Create Client

   #### Settings

   - Client ID = `pims-service-account`
   - Standard Flow Enabled = `true`
   - Implicit Flow Enabled = `false`
   - Direct Access Grants Enabled = `true`
   - Service Accounts Enabled = `true`
   - Root URL = `http://localhost:3000/api`
   - Valid Redirect URIs = `http://localhost:3000/api/*`
   - Base URL = `/`
   - Web Origins = `*`

   #### Service Account Roles

   - Client Roles = `realm-management`
   - Assigned Roles = `realm-admin`

   ![keycloak console](./pims-service-account-config.png)

3. Copy the Client Secret and place it in your `.env` file. And update the environment value to the appropiate one _[Local, Development, Test, Production]_.\_

   ```conf
   ASPNETCORE_ENVIRONMENT=Local
   Keycloak__ClientSecret={Client Secret}
   ```

4. Run the Keycloak Sync Tool

   ```bash
   dotnet run
   ```
