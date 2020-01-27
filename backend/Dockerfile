FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build-env

# # Arguments to init environment variables.
# ARG ASPNETCORE_ENVIRONMENT=Development
ARG connectionString=Host=host.docker.internal;Port=5433;Username=postgres;Password=password;Database=geospatial;
# ARG Keycloak__Secret=6d182cfd-c085-4c2b-a4f7-65ac245cf68a

# # Copy arguments into environment variables.
ENV ASPNETCORE_ENVIRONMENT=${ASPNETCORE_ENVIRONMENT}
ENV ConnectionStrings__GeoSpatial=${connectionString}
ENV Keycloak__Secret=${Keycloak__Secret}

WORKDIR /app

# Copy csproj and restore as distinct layers
COPY *.csproj ./
RUN dotnet restore
RUN dotnet tool install --global dotnet-ef --version 3.1.0
ENV PATH="$PATH:/root/.dotnet/tools"

# Copy everything else and build
COPY . ./
# COPY localhost.pfx ./out/localhost.pfx
RUN dotnet publish -c Release -o out
# RUN dotnet ef database update

# Build runtime image
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 AS runtime
WORKDIR /app

COPY --from=build-env /app/out ./
COPY --from=build-env /app/entrypoint.sh ./entrypoint.sh

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]

EXPOSE 80 433
