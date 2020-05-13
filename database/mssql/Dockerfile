FROM mcr.microsoft.com/mssql/rhel/server:2019-latest

RUN mkdir -p /usr/config
WORKDIR /usr/config
COPY . /usr/config

# Make sure GIT has the following permissions set.
# RUN chmod +x ./entrypoint.sh
# RUN chmod +x ./setup.sh
ENTRYPOINT ["./entrypoint.sh"]

EXPOSE 1433
VOLUME ["/var/opt/mssql"]
