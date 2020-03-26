using System.Linq;
using System.Collections.Generic;
using System;
using Pims.Core.Extensions;
using Moq;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using AutoMapper;

namespace Pims.Api.Test.Helpers
{
    /// <summary>
    /// TestHelper class, provides a way to simplify the Arrange part of a test.
    /// </summary>
    public class TestHelper
    {
        #region Variables
        private readonly static IEnumerable<Type> _profiles;
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
        /// Initialize static variables used TestHelper.
        /// </summary>
        static TestHelper()
        {
            // Find all map profiles in assembly.
            var ptype = typeof(Profile);
            _profiles = AppDomain.CurrentDomain.GetAssemblies().Where(a => a.FullName.StartsWith("Pims")).SelectMany(a => a.GetTypes().Where(at => ptype.IsAssignableFrom(at)));
        }

        /// <summary>
        /// Creates a new instance of a TestHelper class.
        /// </summary>
        public TestHelper()
        {
            var config = new Mock<IConfiguration>();
            this.AddSingleton(config);
            this.AddSingleton(config.Object);
            var keycloakOptions = new Mock<IOptionsMonitor<Keycloak.Configuration.KeycloakOptions>>();
            this.AddSingleton(keycloakOptions.Object);

            var mapper = TestHelper.CreateMapper();
            this.AddSingleton(mapper);
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
        /// Create a AutoMapper object and configure it with all the profiles created in the Pims assemblies.
        /// </summary>
        /// <returns></returns>
        public static IMapper CreateMapper()
        {
            var mapperConfig = new MapperConfiguration(cfg =>
            {
                _profiles.ForEach(p => cfg.AddProfile(p));
            });
            // mapperConfig.AssertConfigurationIsValid(); // TODO: Fix this.
            var mapper = mapperConfig.CreateMapper();

            return mapper;
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
