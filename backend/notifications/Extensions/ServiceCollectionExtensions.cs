using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Pims.Notifications
{
    /// <summary>
    /// ServiceCollectionExtensions static class, provides extension methods for ServiceCollection objects.
    /// </summary>
    public static class ServiceCollectionExtensions
    {
        /// <summary>
        /// Add the NotificationsService to the dependency injection service collection.
        /// </summary>
        /// <param name="services"></param>
        /// <returns></returns>
        public static IServiceCollection AddNotificationsService(this IServiceCollection services)
        {
            return services
                .AddScoped<Dal.Services.INotificationService, NotificationService>()
                .AddScoped<INotificationService, NotificationService>();
        }

        /// <summary>
        /// Add the NotificationsService to the dependency injection service collection.
        /// </summary>
        /// <param name="services"></param>
        /// <param name="section"></param>
        /// <returns></returns>
        public static IServiceCollection AddNotificationsService(this IServiceCollection services, IConfigurationSection section)
        {
            return services
                .Configure<Configuration.NotificationOptions>(section)
                .AddScoped<Dal.Services.INotificationService, NotificationService>()
                .AddScoped<INotificationService, NotificationService>();
        }
    }
}
