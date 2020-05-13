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

All releases should have permanent tags applied to them by our build/deploy pipeline. See [Managing Images](https://docs.openshift.com/container-platform/3.7/dev_guide/managing_images.html) for more details. A permanent tag may either be added manually or using the corresponding step in the CICD Jenkins Pipeline.

Openshift Image streams maintains the history of tracking tags (ie. Dev, Test, Latest) and prunes images periodically based on age and usage. However, in most cases we should be able to rollback to a previous version of a tracking tag before it is pruned. However, in order to keep a complete release history all pushes to prod should be tracked with permanent tags.

In order to rollback a deployment, use `oc rollout undo dc/*` (to rollback the most recent deployment only) or `oc rollback *`. `oc rollback` supports `--to-version x` as well which can be used to rollback multiple releases at the same time. Both of these commands will revert the deployment configuration to the configuration used for that release, including the image, tag and image id. `--dry-run` works for both commands to see what changes will be made by the rollback.

In order to see the id (sha hash) of a given tracking tag, either navigate to the desired deployment config # and click `Edit Yaml` the sha will be under `spec->template->spec->containers->env->image`. The equivalent CLI command is `oc rollout history dc/pims-api-dev --revision=x`

The above process would need to be repeated for all deployment configurations that need to be rolled back (ie. pims-app, pims-api). The database may require migration(s) to be rolled back manually in addition to the oc steps above.

Be aware that `oc rollout undo` and `oc rollback` disable automatic deployment on image change. This flag should be re-enabled as required when the rolled back deployment is no longer required.
