# Use Templates To Generate OpenShift Objects

To configure OpenShift environments first create Templates. Then create the Objects from the Templates.

1. Login `oc login`
2. Select the appropriate Project `oc project [name]`

## 2.1 Database

The backend is an Microsoft SQL Server 2019 database. It is hosted in a Linux container.

### _Deployment Configuration for Database_

1. `oc create --save-config=true -f openshift/templates/pims-db/mssql-deploy.yaml`
2. View the parameters `oc process --parameters pims-db-deployment-template`
3. Create a `.env` file that contains the values for the parameters within the template
4. Create Objects `oc process pims-db-deployment-template --param-file=[.env] | oc create --save-config=true -f -`

## 2.2 Server API

The backend application is a .NET Core 3.1 RESTful API. It is hosted in a Linux container. It uses Keycloak for authentication and authorization. Communication to it requires a JWT Bearer token. The API connects to a Microsoft SQL database hosted in a Linux container.

#### _Build Configuration for Server API_

1. `oc create --save-config=true -f openshift/templates/pims-api/build.yaml`
2. View the parameters `oc process --parameters pims-api-build`
3. Create a `.env` file that contains the values for the parameters within the template
4. Create Objects `oc process pims-api-build --param-file=[.env] | oc create --save-config=true -f -`

#### _Deployment Configuration for Server API_

1. `oc create --save-config=true -f openshift/templates/pims-api/deploy.yaml`
2. View the parameters `oc process --parameters pims-api-deploy`
3. Create a `.env` file that contains the values for the parameters within the template
4. Create Objects `oc process pims-api-deploy --param-file=[.env] | oc create --save-config=true -f -`

## 2.3 Frontend Application

The front-end application is a React app. It is hosted by Nginx and the React app is built for a production release. It is developed with TypeScript to improve standards. It uses Keycloak for authentication. The JWT token will contain authorization information and allows for communication with the API.

#### _Build Configuration for Frontend_

1. `oc create --save-config=true -f openshift/templates/pims-app/build.yaml`
2. View the parameters `oc process --parameters pims-api-build`
3. Create a `.env` file that contains the values for the parameters within the template
4. Create Objects `oc process pims-api-build --param-file=[.env] | oc create --save-config=true -f -`

#### _Deployment Configuration for Frontend_

1. `oc create --save-config=true -f openshift/templates/pims-app/deploy.yaml`
2. View the parameters `oc process --parameters pims-api-deploy`
3. Create a `.env` file that contains the values for the parameters within the template
4. Create Objects `oc process pims-api-deploy --param-file=[.env] | oc create --save-config=true -f -`
