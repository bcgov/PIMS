# OpenShift Routes

Configuration of the PIMS solution can be done in one of two ways presently.
The first is to create external routes that redirect requests to the appropriate services.
The second is to create one route to the frontend application and allow it to redirect requests through Nginx to the appropriate services.

Both ways are viable, but they both independently must be specifically configured.
Both have pros and cons.
Presently the configuration used is separate routes.

> It should also be noted that both options can be configured to run in parallel together if required.

## Separate Routes

Having separate routes removes the dependency of Nginx and the frontend application.
Routing traffic through Nginx on the frontend application is not the most performant.
Additionally if the fontend application is having issues, the backend API will also become unavailable.
Lastly if there are multiple containers running to support the frontend (horizontal scaling) then the additional Nginx routing also scales (which isn't ideal).

### Configuration

The order the routes are created in OpenShift are critical.
All `path` routes should be created first, as they are more specific.
If they are not, the requests will not be directed to the correct service, as they will be incorrectly handled by the more generic route.
Due to a limitation in OpenShift Templates, it does not appear that you can control the order objects are created, as such it requires manually doing this.

It is recommended to first delete all routes before creating them.

```bash
oc process -f api-routes.yaml --param-file=api-routes.env | oc delete -f -
oc process -f app-route.yaml --param-file=app-route.env | oc delete -f -
```

Then create them once again.

```bash
oc process -f api-routes.yaml --param-file=api-routes.env | oc create --save-config=true -f -
oc process -f app-route.yaml --param-file=app-route.env | oc create --save-config=true -f -
```

## Single Route

Having a single route removes the additional complexity of creating multiple routes.
It can also allow for additional control through the use of Nginx.
When using this configuration it is necessary that the other services are follow the configured naming conventions.
Additionally any other route/path configuration will need to be modified to support this (i.e. API Swagger documentation endpoint).

To create the route.

```bash
oc process -f app-route.yaml --param-file=app-route.env | oc create --save-config=true -f -
```
