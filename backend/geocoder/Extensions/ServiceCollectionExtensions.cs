using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Pims.Core.Http;

namespace Pims.Geocoder
{
    /// <summary>
    /// ServiceCollectionExtensions static class, provides extension methods for ServiceCollection objects.
    /// </summary>
    public static class ServiceCollectionExtensions
    {
        /// <summary>
        /// Add the AddGeocoderService to the dependency injection service collection.
        /// </summary>
        /// <param name="services"></param>
        /// <param name="section"></param>
        /// <returns></returns>
        public static IServiceCollection AddGeocoderService(this IServiceCollection services, IConfigurationSection section)
        {
            return services
                .Configure<Configuration.GeocoderOptions>(section)
                .AddScoped<IGeocoderService, GeocoderService>()
                .AddScoped<IHttpRequestClient, HttpRequestClient>();
        }
    }
}
