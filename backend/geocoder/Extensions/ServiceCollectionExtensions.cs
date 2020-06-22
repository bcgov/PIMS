using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Pims.Core.Http;
using Pims.Geocoder;

namespace Pims.Dal.Keycloak
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
            services.Configure<Geocoder.Configuration.GeocoderOptions>(section);
            return services.AddScoped<IGeocoderService, GeocoderService>()
                .AddScoped<IHttpRequestClient, HttpRequestClient>();
        }
    }
}
