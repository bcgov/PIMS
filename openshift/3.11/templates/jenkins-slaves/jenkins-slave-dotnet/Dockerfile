FROM registry.redhat.io/dotnet/dotnet-31-jenkins-agent-rhel7

LABEL \
    io.k8s.display-name="Jenkins Agent .NET Core 3.1" \
    io.k8s.description="The jenkins agent dotnet image has the dotnet tools on top of the jenkins slave base image." \
    io.openshift.tags="openshift,jenkins,agent,dotnet,dotnet31"

ARG SONAR_VERSION=4.9.0

USER 0

# Install SonarQube Scanner
RUN source scl_source enable rh-nodejs10 rh-dotnet31 && \
    fix_permissions() { while [[ $# > 0 ]] ; do chgrp -R 0 "$1" && chmod -R g=u "$1"; shift; done } && \
    dotnet tool install --global dotnet-sonarscanner --version ${SONAR_VERSION} && \
    dotnet tool install --global coverlet.console && \
    fix_permissions "/usr/local/bin" "${HOME}"

ENV PATH=$PATH:$HOME/.dotnet/tools

USER 1001
