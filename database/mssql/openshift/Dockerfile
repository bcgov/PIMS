FROM mssql-rhel-server:2019-latest

RUN mkdir -p /usr/config
WORKDIR /usr/config
COPY . /usr/config

USER root
RUN chmod -R g=u /etc/passwd
USER 10001

ENTRYPOINT ["./entrypoint.sh"]

EXPOSE 1433

VOLUME ["/var/opt/mssql"]
