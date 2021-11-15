# Keycloak Admin Library

This library provides a way to make HTTP requests to the [Keycloak Administration API](https://www.keycloak.org/docs-api/5.0/rest-api/index.html#_overview).
## Setting up local Keycloak to authenticate with DEV

Login to your local Keycloak container: http://localhost:8080/
Click on identity Providers from the left menu, then add a new "provider" of type "Keycloak OpenID Connect".
Give it an alias, it can be anything you want.

Then fill in the following 5 fields:

   Authorization URL: https://dev.oidc.gov.bc.ca/auth/realms/xz0xtue5/protocol/openid-connect/auth

   Token URL: https://dev.oidc.gov.bc.ca/auth/realms/xz0xtue5/protocol/openid-connect/token

   Client Authentication: Client secret sent as post

   Client ID: local-PIMS

   Client Secret: For this you will need to copy the client secret from the "Local-PIMS" client on the Keycloak dev environment

Once this is done, you should have the ability to login to your local PIMS environment using either the default users in the local database or now you should have a "new" option of using your IDIR or BCeID account which will authenticate with Keycloak in DEV.

More documentation to come.
