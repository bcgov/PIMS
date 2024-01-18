FROM mcr.microsoft.com/mssql/rhel/server:2022-latest

USER root
RUN mkdir -p /usr/config
WORKDIR /usr/config
COPY . /usr/config
USER mssql

# Make sure GIT has the following permissions set.
# RUN chmod +x ./entrypoint.sh
# RUN chmod +x ./setup.sh

EXPOSE 1433

VOLUME ["/var/opt/mssql"]
ENTRYPOINT ["./entrypoint.sh"]
