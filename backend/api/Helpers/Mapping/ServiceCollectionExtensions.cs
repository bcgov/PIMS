using Mapster;
using MapsterMapper;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Reflection;

namespace Pims.Api.Helpers.Mapping
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddMapster(this IServiceCollection services, Action<TypeAdapterConfig> options = null)
        {
            var config = new TypeAdapterConfig();
            config.Scan(Assembly.GetAssembly(typeof(Startup)));

            options?.Invoke(config);

            services.AddSingleton(config);
            services.AddScoped<IMapper, ServiceMapper>();

            return services;
        }
    }
}
