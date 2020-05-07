# Jenkins Pipelines

*For details on how these pipelines are deployed into OpenShift, refer to the [OpenShift documentation](../README.md)*

# 1 Application Deployment

### Application (`cicd-pipeline`)

This GitHub webhook triggered pipeline is the main CI/CD pipeline for the project.  It is triggered by each commit to the `dev` branch of the [Property Inventory Management System](https://github.com/bcgov/PIMS) GitHub repository.

This pipeline performs the following operations in sequential order;
- Builds the PIMS application container image which includes `frontend`, `backend`, `database` and other components within a microservices architecture.
- Deploys the resulting artifacts to the `DEV` environment.
- _(TODO) Triggers an asynchronous OWASP Security Scan on the deployed application._

### Test (`promote-to-test-pipeline`)

> :bulb: This section is in progress

This manually triggered pipeline promotes deployments from the `dev` environment to the `test` environment.  To perform the promotion click the **Start Pipeline** on the `promote-to-test-pipeline`.

### Prod (`promote-to-prod-pipeline`)

> :bulb: This section is in progress

This manually triggered pipeline promotes deployments from the `test` environment to the `prod` environment.  To perform the promotion click the **Star Pipeline** on the `promote-to-prod-pipeline`.

# 2 Quality Gates and General Tooling

### SonarQube (`sonarqube-pipeline`)

> :bulb: This section is in progress

This GitHub webhook triggered pipeline is the **static** code quality pipeline for the project.  It is triggered by each commit to the `master` branch of the [Property Inventory Management System](https://github.com/bcgov/PIMS) GitHub repository.

This pipeline performs the following operations in sequential order;

- Performs a static code analysis on the latest source code, providing measures of;
  - Reliability
  - Security
  - Maintainability
  - Duplications
- Uploads the results to the project's SonarQube server.

The results can be found here; [PIMS - Code Quality](#)

## ZAP (`zap-pipeline`)

> :bulb: This section is in progress

The OWASP ZAP Scanning pipeline for this project can be triggered manually or automatically. It is triggered automatically by the Build (`website-pipeline`) pipeline.

This pipeline performs the following operations in sequential order;
- Performs an OWASP ZAP Scan of the deployed website, providing measures of;
  - Security Vulnerabilities
- Uploads the results to the project's SonarQube server.

The results can be found here; [PIMS - Security Scan Results
](#)
