# Jenkins Slaves

```yaml
kind: "BuildConfig"
apiVersion: "v1"
metadata:
  name: "nodejs-asr-pipeline"
spec:
  strategy:
    type: JenkinsPipeline
    jenkinsPipelineStrategy:
      jenkinsfile: |-
      ...
```

https://github.com/openshift/origin/blob/master/examples/jenkins/pipeline/nodejs-sample-pipeline.yaml

# Getting Started

PIMS requires two Jenkins slave images: one for **Node 10** and one for **.NET Core 3.1**. The OpenShift Container Platform Jenkins image provides auto-discovery of the slave images, provided sufficient configuration is provided.

:zap: **IMPORTANT: ** For auto-discovery to work, you need to add a Jenkins slave `ConfigMap` yaml file to the project.

## 1. Using Jenkins Slaves

### Configure Node-10 Slave

1. Change to the project where Jenkins is (or will be) deployed.

   ```bash
   oc project <projectname>
   ```

2. Create a `node10-jenkins-slave.yaml` file. The value used for the **\<serviceAccount\>** element is the account used by the Jenkins slave.

   > If no value is specified, the `default` service account is used.

   ```yaml
   kind: ConfigMap
   apiVersion: v1
   metadata:
     name: nodejs-10-jenkins-slave
     labels:
       role: jenkins-slave
   data:
     node10: |-
       <org.csanchez.jenkins.plugins.kubernetes.PodTemplate>
         <inheritFrom></inheritFrom>
         <name>nodejs-10</name>
         <instanceCap>5</instanceCap>
         <idleMinutes>0</idleMinutes>
         <label>nodejs-10</label>
         <serviceAccount>jenkins</serviceAccount>
         <nodeSelector></nodeSelector>
         <volumes/>
         <containers>
           <org.csanchez.jenkins.plugins.kubernetes.ContainerTemplate>
             <name>jnlp</name>
             <image>registry.access.redhat.com/dotnet/dotnet-31-jenkins-slave-rhel7:latest</image>
             <privileged>false</privileged>
             <alwaysPullImage>true</alwaysPullImage>
             <workingDir>/tmp</workingDir>
             <command></command>
             <args>${computer.jnlpmac} ${computer.name}</args>
             <ttyEnabled>false</ttyEnabled>
             <resourceRequestCpu></resourceRequestCpu>
             <resourceRequestMemory></resourceRequestMemory>
             <resourceLimitCpu></resourceLimitCpu>
             <resourceLimitMemory></resourceLimitMemory>
             <envVars/>
           </org.csanchez.jenkins.plugins.kubernetes.ContainerTemplate>
         </containers>
         <envVars/>
         <annotations/>
         <imagePullSecrets/>
         <nodeProperties/>
   ```

3. Import the configuration into the project.

   ```bash
   oc create -f node10-jenkins-slave.yaml
   ```

   The **nodejs-10** slave image can now be used.

### Configure .NET Core 3.1 Slave

1. Change to the project where Jenkins is (or will be) deployed.

   ```bash
   oc project <projectname>
   ```

2. Create a `dotnet-jenkins-slave.yaml` file. The value used for the \*\*\*\* element is the account used by the Jenkins slave. If no value is specified, the `default` service account is used.

   ```yaml
   kind: ConfigMap
   apiVersion: v1
   metadata:
     name: dotnet-jenkins-slave-31
     labels:
       role: jenkins-slave
   data:
     dotnet31: |-
       <org.csanchez.jenkins.plugins.kubernetes.PodTemplate>
         <inheritFrom></inheritFrom>
         <name>dotnet-31</name>
         <instanceCap>5</instanceCap>
         <idleMinutes>0</idleMinutes>
         <label>dotnet-31</label>
         <serviceAccount>jenkins</serviceAccount>
         <nodeSelector></nodeSelector>
         <volumes/>
         <containers>
           <org.csanchez.jenkins.plugins.kubernetes.ContainerTemplate>
             <name>jnlp</name>
             <image>registry.access.redhat.com/dotnet/dotnet-31-jenkins-slave-rhel7:latest</image>
             <privileged>false</privileged>
             <alwaysPullImage>true</alwaysPullImage>
             <workingDir>/tmp</workingDir>
             <command></command>
             <args>${computer.jnlpmac} ${computer.name}</args>
             <ttyEnabled>false</ttyEnabled>
             <resourceRequestCpu></resourceRequestCpu>
             <resourceRequestMemory></resourceRequestMemory>
             <resourceLimitCpu></resourceLimitCpu>
             <resourceLimitMemory></resourceLimitMemory>
             <envVars/>
           </org.csanchez.jenkins.plugins.kubernetes.ContainerTemplate>
         </containers>
         <envVars/>
         <annotations/>
         <imagePullSecrets/>
         <nodeProperties/>
       </org.csanchez.jenkins.plugins.kubernetes.PodTemplate>
   ```

3. Import the configuration into the project.

   ```bash
   oc create -f dotnet-jenkins-slave.yaml
   ```

   The **dotnet-31** slave image can now be used.

## 2. Reference the appropriate slaves within CI/CD pipeline

> TODO

# Advanced Jenkins Configuration

## Volume Mount Points

The Jenkins image can be run with mounted volumes to enable persistent storage for the configuration:

- **_/var/lib/jenkins_** - This is the data directory where Jenkins stores configuration files including job definitions.

### Configuring Jenkins [Kubernetes Plug-in](https://docs.openshift.com/container-platform/3.11/using_images/other_images/jenkins.html#configuring-the-jenkins-kubernetes-plug-in)

The OpenShift Container Platform Jenkins image includes the pre-installed [Kubernetes plug-in](https://wiki.jenkins-ci.org/display/JENKINS/Kubernetes+Plugin) that allows Jenkins agents to be dynamically provisioned on multiple container hosts using Kubernetes and OpenShift Container Platform.

:bulb: The Jenkins image also provides **auto-discovery** and **auto-configuration** of additional agent images for the Kubernetes plug-in.

With the [OpenShift Sync plug-in](https://github.com/openshift/jenkins-sync-plugin), the Jenkins image on Jenkins start-up searches within the project that it is running for the following:

- Image streams that have the label `role` set to `jenkins-slave`.
- Image stream tags that have the annotation `role` set to `jenkins-slave`.
- ConfigMaps that have the label `role` set to `jenkins-slave`.

When it finds an image stream with the appropriate label, or image stream tag with the appropriate annotation, it generates the corresponding Kubernetes plug-in configuration so you can assign your Jenkins jobs to run in a pod running the container image provided by the image stream.

The name and image references of the image stream or image stream tag are mapped to the name and image fields in the Kubernetes plug-in pod template. You can control the label field of the Kubernetes plug-in pod template by setting an annotation on the image stream or image stream tag object with the key `slave-label`. Otherwise, the name is used as the label.

# References

- https://docs.openshift.com/container-platform/3.11/using_images/other_images/jenkins.html
- https://github.com/openshift/origin/blob/master/examples/jenkins/pipeline/nodejs-sample-pipeline.yaml
- https://access.redhat.com/documentation/en-us/net_core/3.1/html/getting_started_guide/gs_dotnet_on_openshift
- https://www.krenger.ch/blog/openshift-add-or-remove-label/
