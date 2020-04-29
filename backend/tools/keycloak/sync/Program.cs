using System;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

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
                .Configure<ApiOptions>(config.GetSection("Api"))
                .Configure<KeycloakOptions>(config.GetSection("Keycloak"))
                .Configure<SyncOptions>(config.GetSection("Sync"))
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
                .AddTransient<IFactory, Factory>()
                .AddSingleton<IOpenIdConnector, OpenIdConnector>();

            services.AddHttpClient("Pims.Tools.Keycloak.Sync", client => { });

            var provider = services.BuildServiceProvider();
            var logger = provider.GetService<ILogger<Startup>>();

            var result = 0;
            try
            {
                result = await provider.GetService<Startup>().Run(args);
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
            string environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

            return new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .AddJsonFile($"appsettings.{environment}.json", optional: true)
                .AddEnvironmentVariables()
                .AddCommandLine(args ?? new string[0]);
        }
        #endregion
    }
}
