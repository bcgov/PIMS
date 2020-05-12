# OpenShift Resources

OpenShift has a collection of objects called **Resources**, this includes things like templates, secrets, configMaps and more.

All resources have been included in the appropriate configuration templates, however they have also been duplicated here for quick configuration changes.

## Secret Management in OpenShift

In order to keep private keys and other sensitive information out of source control, this project uses **secrets**.

Within OpenShift Container Platform, **secrets** provide a mechanism to hold sensitive information such as passwords, sensitive configuration files, private source repository credentials, and so on. To learn more about OpenShift secrets, click [here](https://docs.openshift.com/container-platform/3.11/dev_guide/secrets.html#secrets-examples).

## Configuration

When using the resources within OpenShift create `.env` files for each resource template to set the appropriate parameter values.

This will output all the parameters for the resource, so that you can create an appropriate `.env` file.

```bash
oc process -f [resource file name.yaml] --parameters
```

Now create the resource in OpenShift.

```bash
oc process -f [resource file name.yaml] --param-file=[param file name.env] | oc create --save-config=true -f -
# or if you want to replace the existing resources
oc process -f [resource file name.yaml] --param-file=[param file name.env] | oc replace --save-config=true -f -
```
