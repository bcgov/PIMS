# Property Inventory Management System (PIMS)

The PIMS solution will provide a geo-spatial inventory of properties to assist Strategic Real Estate Services branch of Real Property Division to manage and oversee the disposal of assets surplus to government, optimize the benefits to the government and citizens of BC related to the management of public real estate assets, and be a trusted source for accurate information for Government owned titled property.

## Description

The PIMS technical architecture stack continues to grow as features and enhancements are added. The current components and integrations are listed below;

### Components

|                                                     | Component             | Name  | Technical Stack | Version    | Description                |
| --------------------------------------------------- | --------------------- | :---: | --------------- | ---------- | -------------------------- |
|                                                     | **Application**       |
| <img src="./images/logo-react.svg" width="25">      | Front-end application |  app  | React/Node      | 16.12.0/10 | UI for PIMS                |
| <img src="./images/logo-dotnetcore.svg" width="25"> | Back-end interface    |  api  | .NET Core       | 3.1        | API for data access        |
| <img src="./images/logo-mssql.svg" width="25">      | Backend database      |  db   | MSSQL           | 2019       | Inventory datasource       |
| <img src="./images/logo-keycloak.png" width="25">   | Authentication        | auth  | KeyCloak        |            | Authenticate users         |
|                                                     | **GIS**               |
| <img src="./images/logo-leaflett.png" width="25">   | Mapping               |  gis  | Leaflet         |            | Source for UI maps         |
|                                                     | **Infrastructure**    |
| <img src="./images/logo-github.svg" width="25">     | Source Code           | repo  | GitHub          |            | Source code repository     |
| <img src="./images/logo-OpenShift.svg" width="25">  | Cloud Hosting         |  env  | OpenShift       |            | Environment for solution   |
| <img src="./images/logo-OpenShift.svg" width="25">  | DevOps Hosting        |  env  | OpenShift       |            | CI/CD pipeline environment |
| <img src="./images/logo-jenkins.svg" width="25">    | DevOps Pipeline       | tool  | OpenShift       |            | CI/CD pipeline tooling     |
| <img src="./images/logo-docker.svg" width="25">     | Containers            | tool  | Docker          |            | Container platform tooling |

## Documentation

> [Architecture](./ARCHITECTURE.md)
