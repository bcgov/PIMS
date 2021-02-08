# jenkins-slave-dotnet

Provides a docker image of the .NET Core 3.1 runtime for use as a Jenkins slave.

## Build local

```bash
docker build -t jenkins-slave-dotnet .
```

## Run local

For local running and experimentation run `docker run -i -t jenkins-slave-dotnet /bin/bash` and have a play once inside the container.

## Build in OpenShift

```bash
oc process -f jenkins-slave-generic-template.yaml \
    -p NAME=jenkins-slave-dotnet \
    -p BUILDER_IMAGE_NAME=registry.redhat.io/dotnet/dotnet-31-jenkins-agent-rhel7 \
    -p SOURCE_CONTEXT_DIR=openshift/4.0/templates/jenkins-slaves/jenkins-slave-dotnet \
    | oc apply -f -
```

For all params see the list in the `../jenkins-slave-generic-template.yaml` or run `oc process --parameters -f ../jenkins-slave-generic-template.yaml`.

## Jenkins

Add a new Kubernetes Container template called `jenkins-slave-dotnet` (if you've build and pushed the container image locally) and specify this as the node when running builds. If you're using the template attached; the `role: jenkins-slave` is attached and Jenkins should automatically discover the slave for you. Further instructions can be found [here](https://docs.openshift.com/container-platform/3.11/using_images/other_images/jenkins.html#using-the-jenkins-kubernetes-plug-in).

Add this new Kubernetes Container template and specify this as the node when running builds.

```
dotnet restore
dotnet publish
```
