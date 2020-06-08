# Security

PIMS is architected and built to adhere to OCIO Information Security Standards.

## Summary or Architecture

This is a highlevel summary of the architecture simply for the purpose of addressing security.
In-depth documentation on the various components and technology is found here [Git](./README.md).

### Authentication

Authentication is performed by SiteMinder (`IDIR`, `BCeID`) via integration with an instance of Keycloak hosted by the Exchange Lab within OpenShift.
All users must have an active account within `IDIR` or `BCeID` to gain access to PIMS.
All private keys are maintained in OpenShift with Secrets (see **Hosting**).

#### Technology

- Oauth2.0
- Open ID Connect (OIDC)
- HTTPS
- SSL

### Authorization

PIMS uses a Claims based Identity architecture to ensure only appropriate access is provided to data.
Claims are managed by Keycloak and implemented within PIMS.
This means that only specific claims have privileges within PIMS.
Claims are applied in both the API and the APP to ensure a consistent and secure experience.

| Claim                | Description                                                         |
| -------------------- | ------------------------------------------------------------------- |
| system-administrator | Manage all users within PIMS                                        |
| agency-administrator | Manage only users within user's agency within PIMS                  |
| admin-users          | Manage user accounts within PIMS                                    |
| admin-roles          | Manager roles within PIMS                                           |
| admin-properties     | Access to properties in other agencies                              |
| admin-projects       | Access to projects in other agencies                                |
| property-view        | View property in user's agency or sub-agencies                      |
| property-add         | Add properties to inventory in user's agency or sub-agencies        |
| property-edit        | Edit properties in user's agency or sub-agencies                    |
| property-delete      | Delete properties from inventory in user's agency or sub-agencies   |
| sensitive-view       | View sensitive properties within user's agency or sub-agencies      |
| dispose-request      | Provides the ability to request disposal of properties              |
| dispose-approve      | Provides the aiblity to approve requests for disposal of properties |
| project-view         | View projects in user's agency or sub-agencies                      |
| project-add          | Add projects in user's agency or sub-agencies                       |
| project-edit         | Edit projects in user's agency or sub-agencies                      |
| project-delete       | Delete projects in user's agency or sub-agencies                    |

#### Technology

- .NET Core Identity
- React keycloak-js

### Hosting

The hosting platform used for PIMS is OpenShift.
The DevOps tools are Jenkins and OpenShift.
Non-sensitive configuration is provided through `json` files within source.
Non-sensitive configuration is provided through OpenShift `Configuration Maps` and `Environment Variables`.
Sensitive configuration is provided through OpenShift `Secrets`.

#### Technology

- OpenShift
- Base64 Encoding
- Environment Variables

### Database

The API database used for storing property inventory is hosted as a Docker container within the OpenShift environment.
External access is not available.
Internal access is only available within the OpenShift Project to approved Pods.
The database is running a MS SQL Database 2019 on a Linux OS.
There are two accounts generated for the database currently; the default `sa` and an account generated for PIMS.
PIMS uses the generated account to gain access to the API database.

No personal information is stored within PIMS.

PIMS is designed to store sensitive property information.
This information is marked as `sensitive` and as such is only visible to users who belong to the owning agency, that have the Claim `sensitive-view`.
Additionally users who have the `admin-properties` and the `sensitive-view` Claims will also have access to this information.

#### Technology

- MS SQL Server 2019
- Linux
- Docker
- OpenShift

## IM/IT Standards

### Appropriate Use

#### 1.2 Guidelines on the Use of Open Source Software

All software, frameworks, tools used and built by or for PIMS is presently Open Source.
PIMS is built under the Apache 2.0 license.

#### 1.3 Electronic Signatures Guide

Presently PIMS does not provide any electronic signatures.
All signatures are provided externally through standard/historical processes.

### Software Development

#### 2.1 Development Standards for Information Systems

All documentation of requirements and constraints is documented in the following locations; Jira, Confluence, Git.
All documentation is visible and reviewed through Scrum Project Management processes and peer reviewed through Pull Requests within Git.
All requirements and constraints are approved through Scrum Project Management processes (i.e. Backlog Refinement, Sprint Planning).

Testing is performed through the following; Manual Developer Testing, Manual QA Testing, Automated unit-test, Automated integration test, UAT Testing, SonarQube analysis, ZAP analysis and Code Coverage Reporting.

All Open Source Development practices are adhered to.

- [Jira](https://pimsteam.atlassian.net/)
- [Confluence](https://pimsteam.atlassian.net/wiki/spaces/PIMS)
- [Git](https://github.com/bcgov/PIMS)
- [ADR](https://github.com/bcgov/PIMS/tree/dev/adr)

#### 2.2 REST API Development Standard

The PIMS API is a RESTful implementation.
It is accessible externally but requires IDIR or BCeID authentication via Oauth2.0.
All HTTP methods are applied appropriately.
URLS only identify a single resource type.
Presently PIMS only support output formats (JSON).
Error messages are always returned in a standard JSON format and only contain appropriate information.
The API is versioned and all URLs adhere to their version.

- Metadata is NOT included in a variable in the response.

### Information Management

#### 3.1 Data Administration Standard

All data within PIMS is currently hosted within the API database.
The Data Model is expressed in the following [ERD](./DATABASE.md).
The entities that compose the database are designed through Code-First modeling provided by Entity Framework Core (EF Core), and can be found within Data Access Layer (DAL) [source](../backend/dal/Migrations/PimsContextModelSnapshot.cs).
All access to the database is managed by the DAL which applies security through the before-mentioned Claim based Identity.

The intent of PIMS is a shared resource between all agencies/ministries to maintain inventory of property for the purpose of disposal and aquisition.

#### 3.4 Physical Address & Geocoding

As PIMS is a property inventory, physical addresses of properties are stored.
Additionally GIS latitude and longitude coordinates captured and stored within the database.

#### 3.5 Date & Time

All dates and times are stored as UTC within the database.

### Identity Management

#### 4.2 BCeID

Authentication is performed by SiteMinder and allows for BCeID access.

#### 4.4 Identity Assurance Standard

PIMS uses a Claim based Identity architecture.
Claims are applied to authenticated users through the application of roles.

### IT Security

#### 6.14 Application & Web Development & Deployment

PIMS has been designed and developed with the latest stable released software, frameworks and tools (.NET Core 3.1, React 16.12.0, MS SQL Server 2019).
GitHub provides regular scans for vunerabilities found within dependencies and submits regular Pull Requests (PR).
During development every effort is made to upgrade and maintain dependency with tight versioning controls.

#### Known Weakness

- Presently the only known vulnerability is the inherit lack of anti-forgery tokens for Open APIs. There are architectural design patterns that can be applied, but they will require additional effort. It should be noted that most if not all Open APIs do not apply anti-forgery tokens.

#### 6.16 Database Security Standard for Information Protection (DSSIP)

Direct access to the database and its host container is only possible through access to the appropriate OpenShift Project.
Additionally access to the PIMS database is only possible with the appropriate account and secret which are generated and only visible within OpenShift.
Databases are backedup on a regular schedule (i.e. nightly).
Access to specific data within the database is managed externally through a Claim based Identity architecture enforced by the DAL.
