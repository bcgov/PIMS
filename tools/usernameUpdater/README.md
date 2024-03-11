# Username Updater

## Purpose

To update usernames in the PIMS database. Original usernames from old PIMS were created using the username from the identity provider then adding either `@idir` or `@bceid` depending on the source. These usernames were specific only to PIMS.

This tool converts all usernames where possible to the format of \<keycloakGuid>@\<identityProvider>, which is provided from Keycloak.

e.g. `00000000-0000-0000-0000-000000000000@idir`

By using this format instead, the user can be compared against the username found in their Keycloak-provided token.

## Usage

1. Populate the `.env` file based on the `.env-template` file. 
    - Using `prod` as the environment is suggested because BCeID users are only found if they have logged in to that environment.
    - The Postgres ENVs specify what database to access. Use port-forwarding to access databases in OpenShift.
2. Run the script using `npm start`

A file called `failures.json` will be produced for any users that could not be found. 
These users will either be deleted if there are no foreign-key constraints using them as a reference or disabled if there are constraints that cause the deletion to fail.
