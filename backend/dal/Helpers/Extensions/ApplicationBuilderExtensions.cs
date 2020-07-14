using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;

namespace Pims.Dal.Helpers.Extensions
{
    /// <summary>
    /// ApplicationBuilderExtensions static class, provides extension methods for ApplicationBuilder objects.
    /// </summary>
    public static class ApplicationBuilderExtensions
    {
        /// <summary>
        /// Initialize the database when the application starts.
        /// This isn't an ideal way to do this, but will work for our purposes.
        /// </summary>
        /// <param name="app"></param>
        public static void UpdateDatabase<T>(this IApplicationBuilder app)
        {
            using var serviceScope = app.ApplicationServices
                .GetRequiredService<IServiceScopeFactory>()
                .CreateScope();
            var logger = serviceScope.ServiceProvider.GetService<ILogger<T>>();

            try
            {
                using var context = serviceScope.ServiceProvider.GetService<PimsContext>();
                context.Database.Migrate();
            }
            catch (Exception ex)
            {
                logger.LogCritical(ex, "Database migration failed on startup.");
            }
        }
    }
}
