using System.Linq;
using System;
using Pims.Core.Extensions;
using Microsoft.Extensions.DependencyInjection;
using MapsterMapper;
using Mapster;
using System.Diagnostics.CodeAnalysis;

namespace Pims.Core.Test
{
    /// <summary>
    /// TestHelper class, provides a way to simplify the Arrange part of a test.
    /// </summary>
    [ExcludeFromCodeCoverage]
    public class TestHelper
    {
        #region Variables
        private IServiceProvider _provider;
        private readonly IServiceCollection _services = new ServiceCollection();
        #endregion

        #region Properties
        /// <summary>
        /// get - The service provider.
        /// </summary>
        /// <value></value>
        public IServiceProvider Provider { get { return _provider; } }

        /// <summary>
        /// get - The services collection.
        /// </summary>
        /// <value></value>
        public IServiceCollection Services { get { return _services; } }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a TestHelper class.
        /// </summary>
        public TestHelper()
        {
            var config = new TypeAdapterConfig();
            var assemblies = AppDomain.CurrentDomain.GetAssemblies().Where(a => a.FullName.StartsWith("Pims"));
            assemblies.ForEach(a => config.Scan(a));

            _services.AddSingleton(config);
            _services.AddScoped<IMapper, ServiceMapper>();
        }
        #endregion

        #region Methods
        /// <summary>
        /// Build the required services for the provider.
        /// Once this is called you can no longer add additional services to the provider.
        /// </summary>
        /// <returns></returns>
        public IServiceProvider BuildServiceProvider()
        {
            if (_provider == null)
            {
                _provider = _services.BuildServiceProvider();
            }
            return _provider;
        }

        /// <summary>
        /// Add a singleton service to the provider.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        public IServiceCollection AddSingleton<T>() where T : class
        {
            if (_provider != null) throw new InvalidOperationException("Cannot add to the service collection once the provider has been built.");
            return _services.AddSingleton<T>();
        }

        /// <summary>
        /// Add a singleton service to the provider.
        /// </summary>
        /// <param name="item"></param>
        /// <typeparam name="T"></typeparam>
        public IServiceCollection AddSingleton<T>(T item) where T : class
        {
            if (_provider != null) throw new InvalidOperationException("Cannot add to the service collection once the provider has been built.");
            return _services.AddSingleton<T>(item);
        }

        /// <summary>
        /// Add a singleton service to the provider.
        /// </summary>
        /// <param name="type"></param>
        /// <param name="item"></param>
        /// <typeparam name="T"></typeparam>
        public IServiceCollection AddSingleton(Type type, object item)
        {
            if (_provider != null) throw new InvalidOperationException("Cannot add to the service collection once the provider has been built.");
            return _services.AddSingleton(type, item);
        }

        /// <summary>
        /// Get the service for the specified 'T' type.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public T GetService<T>()
        {
            return this.BuildServiceProvider().GetService<T>();
        }

        /// <summary>
        /// Get the mapper from the service collection.
        /// </summary>
        /// <returns></returns>
        public IMapper GetMapper()
        {
            return this.BuildServiceProvider().GetService<IMapper>();
        }

        /// <summary>
        /// Creates an instance of the specified type 'T', using dependency injection for any constructor arguments.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public T CreateInstance<T>()
        {
            return (T)ActivatorUtilities.CreateInstance(_provider, typeof(T));
        }
        #endregion
    }
}
