using Mapster;
using MapsterMapper;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Reflection;
using System.Text.Json;

namespace Pims.Api.Helpers.Mapping
{
    /// <summary>
    /// ServiceCollectionExtensions static class, provides extension methods for IServiceCollection.
    /// </summary>
    public static class ServiceCollectionExtensions
    {
        /// <summary>
        /// Add Mapster to the DI service collection.
        /// By default this will scan the assembly for all mappers that inhert IRegister.
        /// </summary>
        /// <param name="services"></param>
        /// <param name="options"></param>
        /// <returns></returns>
        public static IServiceCollection AddMapster(this IServiceCollection services, Action<TypeAdapterConfig> options = null)
        {
            var config = TypeAdapterConfig.GlobalSettings;
            config.Scan(Assembly.GetAssembly(typeof(Startup)));

            options?.Invoke(config);

            services.AddSingleton(config);
            services.AddScoped<IMapper, ServiceMapper>();

            return services;
        }

        /// <summary>
        /// Add Mapster to the DI service collection.
        /// By default this will scan the assembly for all mappers that inhert IRegister.
        /// </summary>
        /// <param name="services"></param>
        /// <param name="serializerOptions"></param>
        /// <param name="options"></param>
        /// <returns></returns>
        public static IServiceCollection AddMapster(this IServiceCollection services, JsonSerializerOptions serializerOptions, Action<TypeAdapterConfig> options = null)
        {
            var config = TypeAdapterConfig.GlobalSettings;

            var optionsSerializer = Microsoft.Extensions.Options.Options.Create(serializerOptions);
            var assemblies = new[] { Assembly.GetAssembly(typeof(Startup)) };
            var registers = assemblies.Select(assembly => assembly.GetTypes()
                .Where(x => typeof(IRegister).GetTypeInfo().IsAssignableFrom(x.GetTypeInfo()) && x.GetTypeInfo().IsClass && !x.GetTypeInfo().IsAbstract))
                .SelectMany(registerTypes =>
                    registerTypes.Select(registerType =>
                        registerType.GetConstructor(Type.EmptyTypes) == null
                        ? (IRegister)Activator.CreateInstance(registerType, new[] { optionsSerializer })
                        : (IRegister)Activator.CreateInstance(registerType))).ToList();

            config.Apply(registers);

            options?.Invoke(config);

            services.AddSingleton(config);
            services.AddScoped<IMapper, ServiceMapper>();

            return services;
        }
    }
}
