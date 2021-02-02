using System;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Pims.Core.Exceptions;
using Pims.Core.Http.Configuration;
using Pims.Tools.Core.Configuration;
using Pims.Tools.Core.Keycloak;
using Pims.Tools.Core.Keycloak.Configuration;
using Pims.Tools.Keycloak.Sync.Configuration;
using Pims.Tools.Keycloak.Sync.Configuration.Realm;

namespace Pims.Tools.Keycloak.Sync
{
    /// <summary>
    /// Program class, provides a console application that will sync keycloak and PIMS roles, groups and users.
    /// </summary>
    /// <reference url="https://docs.microsoft.com/en-us/aspnet/core/fundamentals/logging/?view=aspnetcore-3.1"/>
    static class Program
    {
        #region Methods
        /// <summary>
        /// Entry point to program.
        /// </summary>
        /// <param name="args"></param>
        static async Task<int> Main(string[] args)
        {
            var config = Configure(args)
                .Build();

            var services = new ServiceCollection()
                .Configure<ToolOptions>(config)
                .Configure<RequestOptions>(config)
                .Configure<ApiOptions>(config.GetSection("Api"))
                .Configure<RealmOptions>(config.GetSection("Realm"))
                .Configure<KeycloakOptions>(config.GetSection("Auth:Keycloak"))
                .Configure<OpenIdConnectOptions>(config.GetSection("Auth:OpenIdConnect"))
                .Configure<JsonSerializerOptions>(options =>
                {
                    if (Boolean.TryParse(config["Serialization:Json:IgnoreNullValues"], out bool ignoreNullValues))
                        options.IgnoreNullValues = ignoreNullValues;
                    if (Boolean.TryParse(config["Serialization:Json:PropertyNameCaseInsensitive"], out bool nameCaseInsensitive))
                        options.PropertyNameCaseInsensitive = nameCaseInsensitive;
                    if (config["Serialization:Json:PropertyNamingPolicy"] == "CamelCase")
                        options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
                    if (Boolean.TryParse(config["Serialization:Json:WriteIndented"], out bool writeIndented))
                        options.WriteIndented = writeIndented;
                })
                .AddSingleton<IConfiguration>(config)
                .AddLogging(options =>
                {
                    options.AddConfiguration(config.GetSection("Logging"));
                    options.AddConsole();
                })
                .Configure<LoggerFilterOptions>(options =>
                {
                    options.MinLevel = LogLevel.Information;
                })
                .AddTransient<Startup>()
                .AddTransient<JwtSecurityTokenHandler>()
                .AddScoped<IKeycloakRequestClient, KeycloakRequestClient>()
                .AddTransient<IRealmFactory, RealmFactory>()
                .AddTransient<ISyncFactory, SyncFactory>();

            services.AddHttpClient("Pims.Tools.Keycloak.Sync", client => { });

            var provider = services.BuildServiceProvider();
            var logger = provider.GetService<ILogger<Startup>>();

            var result = 0;
            try
            {
                result = await provider.GetService<Startup>().Run(args);
            }
            catch (HttpClientRequestException ex)
            {
                logger.LogCritical(ex, $"An HTTP request failed - {ex.StatusCode}: {ex.Message}");
                result = 1;
            }
            catch (Exception ex)
            {
                logger.LogCritical(ex, "An unhandled error has occurred.");
                result = 1;
            }

            provider.Dispose();
            return result;
        }

        /// <summary>
        /// Configure host.
        /// </summary>
        /// <param name="args"></param>
        /// <returns></returns>
        private static IConfigurationBuilder Configure(string[] args)
        {
            DotNetEnv.Env.Load();
            string environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT").ToLower();

            return new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .AddJsonFile($"appsettings.{environment}.json", optional: true)
                .AddJsonFile("realm.json")
                .AddJsonFile($"realm.{environment}.json", optional: true)
                .AddEnvironmentVariables()
                .AddCommandLine(args ?? new string[0]);
        }
        #endregion
    }
}
