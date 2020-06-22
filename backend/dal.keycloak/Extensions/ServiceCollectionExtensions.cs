using Microsoft.Extensions.DependencyInjection;
using Pims.Keycloak;

namespace Pims.Dal.Keycloak
{
    /// <summary>
    /// ServiceCollectionExtensions static class, provides extension methods for ServiceCollection objects.
    /// </summary>
    public static class ServiceCollectionExtensions
    {
        /// <summary>
        /// Add the PimsKeycloakService to the dependency injection service collection.
        /// </summary>
        /// <param name="services"></param>
        /// <returns></returns>
        public static IServiceCollection AddPimsKeycloakService(this IServiceCollection services)
        {
            return services.AddScoped<IPimsKeycloakService, PimsKeycloakService>()
                .AddScoped<IKeycloakService, KeycloakService>();
        }
    }
}
