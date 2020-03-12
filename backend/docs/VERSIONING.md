# PIMS API Versioning

Refer to the [Versioning](../docs/VERSIONS.md) documentation for more information.

How to configure csharp project versions [here](https://andrewlock.net/version-vs-versionsuffix-vs-packageversion-what-do-they-all-mean/).

## Configuration

Each release of the backend projects will require their version information to be manually updated (until we can automate).

To do this edit their `csproj` files.

```xml
<?xml version="1.0" encoding="utf-8"?>
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>netcoreapp3.1</TargetFramework>
    <UserSecretsId>0ef6255f-9ea0-49ec-8c65-c172304b4926</UserSecretsId>
    <LangVersion>8.0</LangVersion>
    <Version>0.1.0.1-alpha</Version>
    <AssemblyVersion>0.1.0.1</AssemblyVersion>
  </PropertyGroup>
...
</Project>
```

| Node                | Description                                                                                        |
| ------------------- | -------------------------------------------------------------------------------------------------- |
| **Version**         | The primary version identification used for the release.                                           |
| **FileVersion**     | The version information found in the file properties. By default it will use the assembly version. |
| **AssemblyVersion** | The primary version identification without the suffix.                                             |
