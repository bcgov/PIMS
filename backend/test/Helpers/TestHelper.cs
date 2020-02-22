using System;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Pims.Api.Helpers.Profiles;

namespace Pims.Api.Test.Helpers
{
    /// <summary>
    /// TestHelper class, provides a way to simplify the Arrange part of a test.
    /// </summary>
    public class TestHelper
    {
        #region Variables
        private IServiceProvider _provider;
        private readonly IServiceCollection _services = new ServiceCollection ();
        #endregion

        #region Properties
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a TestHelper class.
        /// </summary>
        public TestHelper ()
        {
            var config = new Mock<IConfiguration> ();
            this.AddSingleton (config);
            this.AddSingleton (config.Object);

            var mapper = TestHelper.CreateMapper ();
            this.AddSingleton (mapper);
        }
        #endregion

        #region Methods
        public IServiceProvider BuildServiceProvider ()
        {
            if (_provider == null)
            {
                _provider = _services.BuildServiceProvider ();
            }
            return _provider;
        }

        public IServiceCollection AddSingleton<T> () where T : class
        {
            if (_provider != null) throw new InvalidOperationException ("Cannot add to the service collection once the provider has been built.");
            return _services.AddSingleton<T> ();
        }

        public IServiceCollection AddSingleton<T> (T item) where T : class
        {
            if (_provider != null) throw new InvalidOperationException ("Cannot add to the service collection once the provider has been built.");
            return _services.AddSingleton<T> (item);
        }

        public T GetService<T> ()
        {
            return this.BuildServiceProvider ().GetService<T> ();
        }

        public static IMapper CreateMapper ()
        {
            var mapperConfig = new MapperConfiguration (cfg =>
            {
                cfg.AddProfile (new ParcelProfile ());
                cfg.AddProfile (new AddressProfile ());
                cfg.AddProfile (new BuildingProfile ());
                cfg.AddProfile (new BaseProfile ());
            });
            var mapper = mapperConfig.CreateMapper ();

            return mapper;
        }
        #endregion
    }
}
