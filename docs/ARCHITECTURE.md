## Architectural Summary

- REST API
- Frontend
- Database
- Membership Authentication/Authorization
  - KeyCloak
  - KeyCloak DB
- GIS Map interface
  - Leaflet
- DevOps
  - Containerized Docker solution
  - Build/Deploy scripts

## Architectural Design
All components of the solution are configured for Docker containers to run independently and therefore scallable.

### APP
The APP frontend will be a React application that will provide the user interface.  It will provide authentication/authorization with KeyCloak (Using Open ID Connect).  To communicate with the API it will proxy requests that begin with `/api` to the configured API host.

It will be written in React and have a Node backend.

### API

The API will be RESTful design, providing authentication/authorization with KeyCloak (Using JWT Bearer tokens).

It will be written in .NET Core 3.1.

It will use a PostgreSQL database backend to store My Places that are created by users.

#### Endpoints

| Endpoint                | Route                           | Params | Body    | Returns           | Note                                    |
| ----------------------- | ------------------------------- | ------ | ------- | ----------------- | --------------------------------------- |
| Get my places           | /api/my/places                  |        |         | Place[]           | [auth] filtered by current user         |
| Get a place             | /api/my/places/{id}             | id     |         | Place             | [auth] only allow current users places  |
| Add a place             | /api/my/places                  |        | Place   | Place             | [auth] link to current user             |
| Update a place          | /api/my/places/{id}             | id     | Place   | Place             | [auth] only allow current user or admin |
| Delete a place          | /api/my/places/{id}             | id     |         | Place             | [auth] only allow current user or admin |
| Get all places          | /api/all/places                 |        | Place[] | [auth] only admin |
| Get all places filtered | /api/all/places?userId={userId} | userId |         | Place[]           | [auth] only admin                       |
| Get all users           | /api/users                      |        |         | User[]            | [auth]                                  |

### Objects

Currently the only objects uses are `Place` and `User`.
Based on current functionality we should only need to capture `Place` in the database.

#### Place

| Name        | Type     | Length | Required | Note     |
| ----------- | -------- | ------ | -------- | -------- |
| Id          | Int      |        | \*       | Identity |
| Lat         | Float    |        | \*       |
| Lng         | Float    |        | \*       |
| Note        | String   | 2000   |
| OwnerId     | Guid     |        | \*       |
| CreatedOn   | DateTime |        | \*       |
| UpdatedOn   | DateTime |
| UpdatedById | Guid     |

#### User

- May not need this if we can get KeyCloak to provide

  | Name      | Type   | Length | Required | Note |
  | --------- | ------ | ------ | -------- | ---- |
  | Id        | Guid   |        | \*       |      |
  | FirstName | String | 150    |
  | LastName  | String | 150    |
