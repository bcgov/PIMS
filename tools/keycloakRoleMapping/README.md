# Keycloak Roles Transfer Scripts

## Purpose

During the PIMS modernization project, the multiple Keycloak integrations were reworked into one singular one, and the names of roles were also changed from their original values.

These scripts were created to transfer the existing roles and re-map them to the new roles for each user.

## Instructions

### Setup

1. Node must be installed on your local system for this to work.
2. Use the command `npm i` from this directory to install the necessary dependencies.
3. Create a `.env` file using the `.env-template` file as an example. These keys should be available through the [Keycloak dashboard](https://bcgov.github.io/sso-requests).

### Commands

- `npm run extract`: Takes all users and roles from specified integration and saves a JSON file in this directory with their mappings.
- `npm run import`: Uses the JSON file saved in the extract command to transform and apply the old roles to new roles, applying them to relevant users.
