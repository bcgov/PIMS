FROM registry.access.redhat.com/openshift3/jenkins-slave-base-rhel7:v3.11

LABEL \
    io.k8s.display-name="Jenkins Agent Nodejs" \
    io.k8s.description="The jenkins agent nodejs image has the nodejs tools on top of the jenkins slave base image." \
    io.openshift.tags="openshift,jenkins,agent,nodejs"

ARG NODE_VERSION=v10.20.1
ARG SONAR_VERSION=4.3.0.2102

USER 0

# Install Nodejs 10, SonarQube Scanner
RUN fix_permissions() { while [[ $# > 0 ]] ; do chgrp -R 0 "$1" && chmod -R g=u "$1"; shift; done } && \
    set -x && \
    curl -sSL -o /tmp/sonar-scanner-cli.zip https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${SONAR_VERSION}-linux.zip && \
    unzip /tmp/sonar-scanner-cli.zip -d /tmp/sonar-scanner-cli && \
    mv /tmp/sonar-scanner-cli/sonar-scanner-${SONAR_VERSION}-linux /opt/sonar-scanner && \
    ln -s /opt/sonar-scanner/bin/sonar-scanner /usr/local/bin && \
    rm -rf /tmp/sonar-scanner-cli.zip && \
    rm -rf /tmp/sonar-scanner-cli && \
    curl -sSL https://nodejs.org/dist/${NODE_VERSION}/node-${NODE_VERSION}-linux-x64.tar.xz | tar -Jx -C /opt && \
    mv /opt/node-${NODE_VERSION}-linux-x64 /opt/node && \
    fix_permissions '/opt/sonar-scanner' '/opt/node'

ENV NODE_HOME=/opt/node \
    PATH=$PATH:/opt/node/bin

USER 1001
