# PIMS Versioning

The solution will use [**Semantic Versioning 2.0**](https://semver.org/) to version all components.

1. MAJOR version when you make incompatible API changes,
2. MINOR version when you add functionality in a backwards compatible manner, and
3. PATCH version when you make backwards compatible bug fixes.

> [major].[minor].[patch].[build]

This will result in a versions like the following _1.0.34.3435_, or when preparing for a new release _1.0.34-alpha.3435_. Each new build should automatically update the build number (this does not yet work).

## Versions

| Version       | Name  | Date           | Description           |
| ------------- | ----- | -------------- | --------------------- |
| 0.1.0.0-alpha | Bones | March 24, 2020 | Initial alpha release |

## Rollback

All releases should have permanent tags applied to them by our build/deploy pipeline. See [Managing Images](https://docs.openshift.com/container-platform/3.7/dev_guide/managing_images.html) for more details.

A new deployment instance will always be created in order to deploy an image with a unique permanent tag. This is what allows the rollback commands discussed below.

In order to rollback the deployment of a permanent tag, use `oc rollout undo dc/*` (to rollback the most recent deployment only) or `oc rollback *`. `oc rollback` supports `--to-version x` as well which can be used to rollback multiple releases at the same time. Both of these commands will revert the deployment configuration to the configuration used for that release, including the image and tag. `--dry-run` works for both commands to see what changes will be made by the rollback. Note that the commands listed above are completely reliant on proper permanent tagged images during pipeline builds. Images using tracking tags are overwritten during every change to source, as a result there is no way of rolling back those images other than creating a new release.

The above process would need to be repeated for all deployment configurations that need to be rolled back (ie. pims-app, pims-api). The database may require migration(s) to be rolled back manually in addition to the oc steps above.

Be aware that `oc rollout undo` and `oc rollback` disable automatic deployment on image change. This flag should be re-enabled as required when the rolled back deployment is no longer required.
