using System;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Pims.Geocoder;
using Pims.Tools.Converters.ExcelConverter.Configuration;
using Pims.Tools.Converters.ExcelConverter.Converters;

namespace Pims.Tools.Converters.ExcelConverter
{
    /// <summary>
    /// Program class, provides a console application that can read an Excel file and convert it to JSON.
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
                .AddSingleton<IConfiguration>(config)
                .Configure<ConverterOptions>(config.GetSection("Converter"))
                .Configure<GeocoderOptions>(config.GetSection("Geocoder"))
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
                .AddLogging(options =>
                {
                    options.AddConfiguration(config.GetSection("Logging"));
                    options.AddConsole();
                })
                .Configure<LoggerFilterOptions>(options =>
                {
                    options.MinLevel = LogLevel.Information;
                })
                .AddGeocoderService(config.GetSection("Geocoder"))
                .AddSingleton<IGeoLocationConverter, GeoLocationConverter>()
                .AddTransient<IConverter, Converter>()
                .AddTransient<Startup>();

            services.AddHttpClient("Pims.Tools.Conveter", client => { });

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
