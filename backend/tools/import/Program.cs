using System;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Pims.Tools.Import
{
    /// <summary>
    /// Program class, provides a console application that can read and iterate through a JSON file and make HTTP requests to an endpoint.
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

            var provider = new ServiceCollection()
                .Configure<ToolOptions>(config)
                .AddSingleton<IConfiguration>(config)
                .AddLogging(options =>
                {
                    options.AddConfiguration(config.GetSection("Logging"));
                    options.AddConsole();
                    options.AddEventLog();
                })
                .Configure<LoggerFilterOptions>(options =>
                {
                    options.MinLevel = LogLevel.Information;
                })
                .AddTransient<Startup>()
                .AddTransient<JwtSecurityTokenHandler>()
                .BuildServiceProvider();

            var logger = provider.GetService<ILogger<Startup>>();

            try
            {
                return await provider.GetService<Startup>().Run(args);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An unhandled error has occurred.");
                return 1;
            }
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
                .AddJsonFile($"appsettings.{environment}.json", optional : true)
                .AddEnvironmentVariables()
                .AddCommandLine(args ?? new string[0]);
        }
        #endregion
    }
}
