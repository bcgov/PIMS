using Microsoft.Extensions.Configuration;
using System;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using System.Diagnostics.CodeAnalysis;

namespace Pims.Api.Helpers.Logging
{
    [ExcludeFromCodeCoverage]
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
