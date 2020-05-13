# Import Base Images

## Import image `nodejs-10-rhel7:1-30` from Red Hat

This image will be used by the frontend build. As with other base images it should be configured in your **Tools** environment. At the time of writing, PIMS is using **nodejs-10-rhel7:1-30**

Use the following instructions to get images from a Red Hat container registry using registry service account tokens. You will need to [create a registry service account](https://access.redhat.com/terms-based-registry/) to use prior to completing any of the following tasks.

## Authenticating with Red Hat container registry

To retrieve content from an authenticated registry, you will need to log into the registry using either your Customer Portal, Red Hat Developer, or Registry Service Account credentials.

To login to the [registry.redhat.io](https://catalog.redhat.com/software/containers/explore) registry, you can use _docker login_ command.

:zap: **IMPORTANT** - For OpenShift or other shared environments, it is recommended to use _Service Accounts_ in place of an individual's Customer Portal credentials.

### Creating Registry Service Accounts

Navigate to the [Registry Service Account Management Application](https://access.redhat.com/terms-based-registry/), and log in (or create a free Red Hat devloper account) if necessary.

1. From the **Registry Service Accounts** page, click **Create Service Account**
2. Provide a name for the Service Account. It will be prepended with a fixed, random string.
   - Enter a description.
   - Click create.
3. Navigate back to your Service Accounts.
4. Click the Service Account you created.
   - Note the username, including the prepended string (i.e. `XXXXXXX|username`). This is the username which should be used to login to registry.redhat.io.
   - Note the password. This is the password which should be used to login to registry.redhat.io.

There are tabs available within the Token Information page which offer guidance on how to use the authentication token for various scenarios. For example, the **Docker Login** tab demonstrates how the token can be used with the docker CLI.
