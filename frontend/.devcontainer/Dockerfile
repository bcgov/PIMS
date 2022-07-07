# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.194.0/containers/typescript-node/.devcontainer/base.Dockerfile

# [Choice] Node.js version: 16, 14, 12
ARG VARIANT="14-buster"
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-${VARIANT}

ENV NVM_DIR="/usr/local/share/nvm"
ENV NVM_SYMLINK_CURRENT=true \
    PATH=${NVM_DIR}/current/bin:${PATH}
COPY library-scripts/node-debian.sh /tmp/library-scripts/

# [Optional] Uncomment this section to install additional OS packages.
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
  && apt-get -y install --no-install-recommends git libstdc++6 \
  && bash /tmp/library-scripts/node-debian.sh "${NVM_DIR}"

# [Optional] Uncomment if you want to install an additional version of node using nvm
ARG EXTRA_NODE_VERSION=v14.19.3
RUN su node -c "npm config delete prefix"
RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"
RUN su node -c "npm config set prefix $NVM_DIR/versions/node/${EXTRA_NODE_VERSION}"
RUN su node -c "npm install npm@8.5.5 -g"

# [Optional] Uncomment if you want to install more global node packages
RUN su node -c "npm install -g create-react-app"
