using System;
using System.Security.Claims;
using System.Threading.Tasks;
using BackendApi;
using BackendApi.Controllers;
using BackendApi.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.InMemory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace BackendApi.Test.Controllers
{
    public class PlacesControllerTest
    {
        #region Variables
        private readonly PlacesController _placesController;
        #endregion

        #region Constructors
        public PlacesControllerTest ()
        {
            var logger = new Mock<ILogger<PlacesController>> ();
            var config = new Mock<IConfiguration> ();
            var dbContext = GetDatabaseContext ();
            _placesController = new PlacesController (logger.Object, config.Object, dbContext);

            var user = new ClaimsPrincipal (new ClaimsIdentity (new Claim[]
            {
                new Claim (ClaimTypes.NameIdentifier, Guid.NewGuid ().ToString ()),
                    new Claim (ClaimTypes.Role, "contributor")
            }, "mock"));
            _placesController.ControllerContext = new ControllerContext ()
            {
                HttpContext = new DefaultHttpContext () { User = user }
            };
        }
        #endregion

        #region Tests
        [Fact]
        public void GetMyPlaces ()
        {
            // Arrange

            // Act
            var result = _placesController.GetMyPlaces ();

            // Assert
            var actionResult = Assert.IsType<JsonResult> (result);
            Assert.True (true);
        }
        #endregion

        #region Methods
        private GeoSpatialContext GetDatabaseContext ()
        {
            var options = new DbContextOptionsBuilder<GeoSpatialContext> ()
                .UseInMemoryDatabase (databaseName: Guid.NewGuid ().ToString ())
                .Options;
            var databaseContext = new GeoSpatialContext (options);
            databaseContext.Database.EnsureCreated ();
            return databaseContext;
        }
        #endregion
    }
}
