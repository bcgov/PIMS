# Network Security Policies

Each project namespace is by default a [Zero Trust Security Model](https://developer.gov.bc.ca/Platform-Services-Security/Developer-Guide-to-Zero-Trust-Security-Model-on-the-Platform).

Configure each project namespace with the appropriate Network Security Policy (NSP) to enable appropriate communication between projects, pods, internal k8s cluster api and the internet.

To simplify NSP **label** your **DeploymentConfig** objects with `app`, `role` and `env` (or any other appropriate label to identify them).

```yaml
- kind: DeploymentConfig
  apiVersion: v1
  metadata:
    name: pims-web-dc
    labels:
      app: pims
      role: web
      env: prod
    annotations:
      description: How to deploy the pims web application pod.
  spec:
    strategy:
  ...
```

Go to - `/pims/openshift/4.0/templates/network-security-policy`

Configure the TOOLS project namespace.

```bash
oc process -f nsp-tools.yaml | oc create --save-config=true -f -
```

Create a configuration file for each environment `nsp.dev.env`, `nsp.test.env`, `nsp.prod.env`.
Configure each file appropriately for each environment.

**Example**

```conf
ENV_NAME=dev
```

Configure each environment project namespace (DEV, TEST, PROD).

```bash
oc process -f nsp.yaml --param-file=nsp.dev.env | oc create --save-config=true -f -
oc process -f nsp.yaml --param-file=nsp.test.env | oc create --save-config=true -f -
oc process -f nsp.yaml --param-file=nsp.prod.env | oc create --save-config=true -f -
```

If at any time an update needs to be made to the NSP, update the templates and run the `apply` command.

Enable the **Service Account** to pull images from external sources.

```bash
oc project 354028-dev
oc policy add-role-to-user system:image-puller system:serviceaccount:$(oc project --short):default -n 354028-tools

oc project 354028-test
oc policy add-role-to-user system:image-puller system:serviceaccount:$(oc project --short):default -n 354028-tools

oc project 354028-prod
oc policy add-role-to-user system:image-puller system:serviceaccount:$(oc project --short):default -n 354028-tools
```

**Example**

```bash
oc process -f {template file name} --param-file={parameter file name} | oc apply -f -
```

Also remember to delete any NSP that are no longer relevant.

**Example**

```bash
oc delete nsp {name}
```
