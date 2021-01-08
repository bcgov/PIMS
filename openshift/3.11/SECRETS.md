# Using OpenShift secrets

First, you will need to add a reference to the appropriate secret and repository to your Kubernetes pod configuration via an imagePullSecrets field. For additional information go [here](https://docs.openshift.com/container-platform/3.11/dev_guide/managing_images.html#using-image-pull-secrets) and [here](https://access.redhat.com/solutions/4177741).

_You only need to do this once - all subsequent imports from registry.redhat.io will use the secret_

```bash
apiVersion: v1
kind: Pod
metadata:
  name: {POD-NAME}
  namespace: {TARGET-NAMESPACE or all}
  spec:
    containers:
      - name: web
        image: registry.redhat.io/rhscl/nodejs-10-rhel7

    imagePullSecrets:
      - name: {PULL-SECRET-NAME}
```

Then, use the following from the command line or from the OpenShift Dashboard GUI interface.

```bash
oc import-image rhscl/nodejs-10-rhel7:1-30 --from=registry.redhat.io/rhscl/nodejs-10-rhel7:1-30 --confirm
```
