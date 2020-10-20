using Microsoft.Extensions.Configuration;
using System;
using System.Reflection;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using Serilog.Sinks.Elasticsearch;

namespace Pims.Api.Helpers.Logging
{
    public static class LoggerExtensions
    {
        public static IServiceCollection AddSerilogging(
            this IServiceCollection services, IConfiguration configuration
        )
        {
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            if (environment != null && !environment.EndsWith("Local")) {

                Log.Logger = new LoggerConfiguration()
                    .Enrich.FromLogContext()
                    .Enrich.WithMachineName()
                    .WriteTo.Debug()
                    .WriteTo.Console()
                    .WriteTo.Elasticsearch(ConfigureElasticSink(configuration, environment))
                    .Enrich.WithProperty("Environment", environment)
                    .ReadFrom.Configuration(configuration)
                    .CreateLogger();
            }
            return services;
        }

        private static ElasticsearchSinkOptions ConfigureElasticSink(IConfiguration configuration, string environment)
        {
            return new ElasticsearchSinkOptions(new Uri(configuration["Elastic:Uri"]))
            {
                ModifyConnectionSettings = x => x.BasicAuthentication(
                    configuration["Elastic:Username"],
                    configuration["Elastic:Password"]),
                AutoRegisterTemplate = true,
                IndexFormat = $"{Assembly.GetExecutingAssembly().GetName().Name.ToLower().Replace(".", "-")}-{environment?.ToLower().Replace(".", "-")}-{DateTime.UtcNow:yyyy-MM}"
            };
        }
    }
}
