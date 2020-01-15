# Get community edition of nodejs v6.x
FROM centos/nodejs-8-centos7

RUN curl -o- -L https://yarnpkg.com/install.sh | bash

ENV PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"