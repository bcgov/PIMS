using System;
using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using Pims.Api.Helpers.Profiles;
using AdminProfiles = Pims.Api.Areas.Admin.Profiles;
using KeycloakProfiles = Pims.Api.Areas.Keycloak.Profiles;

namespace Pims.Api.Test.Helpers
{
    /// <summary>
    /// TestHelper class, provides a way to simplify the Arrange part of a test.
    /// </summary>
    public class TestHelper
    {
        #region Variables
        private IServiceProvider _provider;
        private readonly IServiceCollection _services = new ServiceCollection();
        #endregion

        #region Properties
        #endregion

        #region Constructors
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
        /// <typeparam name="T"></typeparam>
        public IServiceCollection AddSingleton<T>(T item) where T : class
        {
            if (_provider != null) throw new InvalidOperationException("Cannot add to the service collection once the provider has been built.");
            return _services.AddSingleton<T>(item);
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
        /// Create a AutoMapper mapper.
        /// </summary>
        /// <returns></returns>
        public static IMapper CreateMapper()
        {
            var mapperConfig = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new ParcelProfile());
                cfg.AddProfile(new AddressProfile());
                cfg.AddProfile(new BuildingProfile());
                cfg.AddProfile(new BaseProfile());
                cfg.AddProfile(new AgencyProfile());
                cfg.AddProfile(new AccessRequestProfile());
                cfg.AddProfile(new CodeProfile());
                cfg.AddProfile(new UserProfile());
                cfg.AddProfile(new RoleProfile());
                cfg.AddProfile(new LookupProfile());
                cfg.AddProfile(new AdminProfiles.AgencyProfile());
                cfg.AddProfile(new AdminProfiles.UserProfile());
                cfg.AddProfile(new AdminProfiles.RoleProfile());
                cfg.AddProfile(new KeycloakProfiles.BaseProfile());
                cfg.AddProfile(new KeycloakProfiles.UserProfile());
                cfg.AddProfile(new KeycloakProfiles.RoleProfile());
                cfg.AddProfile(new KeycloakProfiles.AgencyProfile());
            });
            // mapperConfig.AssertConfigurationIsValid(); // TODO: Fix this.
            var mapper = mapperConfig.CreateMapper();

            return mapper;
        }

        /// <summary>
        /// Creates an instance of a controller of the specified 'T' type and initializes it with the specified 'user'.
        /// </summary>
        /// <param name="user"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public T CreateController<T>(ClaimsPrincipal user) where T : ControllerBase
        {
            this.AddSingleton<ILogger<T>>(Mock.Of<ILogger<T>>());
            if (_provider == null) this.BuildServiceProvider();
            var controller = (T)ActivatorUtilities.CreateInstance(_provider, typeof(T));
            controller.ControllerContext = ControllerHelper.CreateControllerContext(user);

            return controller;
        }
        #endregion
    }
}
