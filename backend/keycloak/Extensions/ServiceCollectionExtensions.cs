using Microsoft.Extensions.DependencyInjection;

namespace Pims.Keycloak
{
    /// <summary>
    /// ServiceCollectionExtensions static class, provides extension methods for ServiceCollectionExtensions objects.
    /// </summary>
    public static class ServiceCollectionExtensions
    {
        /// <summary>
        /// Add the PimsKeycloakService to the dependency injection service collection.
        /// </summary>
        /// <param name="services"></param>
        /// <returns></returns>
        public static IServiceCollection AddKeycloakService(this IServiceCollection services)
        {
            return services.AddScoped<IKeycloakService, KeycloakService>();
        }
    }
}
