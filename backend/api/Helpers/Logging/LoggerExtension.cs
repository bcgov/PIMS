using Microsoft.Extensions.Configuration;
using System;
using System.Reflection;
using Microsoft.Extensions.DependencyInjection;
using Serilog;

namespace Pims.Api.Helpers.Logging
{
    public static class LoggerExtensions
    {
        public static IServiceCollection AddSerilogging(
            this IServiceCollection services, IConfiguration configuration
        )
        {
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            if (environment != null && !environment.EndsWith("Local"))
            {

                Log.Logger = new LoggerConfiguration()
                    .Enrich.FromLogContext()
                    .Enrich.WithMachineName()
                    .WriteTo.Debug()
                    .WriteTo.Console()
                    .Enrich.WithProperty("Environment", environment)
                    .ReadFrom.Configuration(configuration)
                    .CreateLogger();
            }
            return services;
        }
    }
}
