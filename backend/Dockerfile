ARG BUILD_CONFIGURATION=Release
FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 443 8080

# Copy csproj and restore as distinct layers
FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY *.sln .
COPY api/*.csproj api/
COPY entities/*.csproj entities/
COPY tests/core/*.csproj tests/core/
COPY tests/unit/api/*.csproj tests/unit/api/
COPY tests/unit/dal/*.csproj tests/unit/dal/
COPY dal/*.csproj dal/
COPY dal.keycloak/*.csproj dal.keycloak/
COPY keycloak/*.csproj keycloak/
COPY geocoder/*.csproj geocoder/
COPY ches/*.csproj ches/
COPY notifications/*.csproj notifications/
COPY core/*.csproj core/

RUN dotnet restore
ENV PATH="$PATH:/root/.dotnet/tools"
RUN dotnet tool install --global dotnet-ef --version 5.0.17
# Copy everything else and build
COPY . .
WORKDIR /src/api
RUN dotnet build "Pims.Api.csproj" -c "$BUILD_CONFIGURATION" -o /app/build

FROM build AS publish
RUN dotnet publish "Pims.Api.csproj" -c "$BUILD_CONFIGURATION" -o /app/publish

# Runtime image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
COPY entrypoint.sh .
RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]
