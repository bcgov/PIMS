using System;
using System.Security.Claims;
using Pims.Api.Controllers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Models;
using Pims.Api.Helpers.Profiles;
using Pims.Dal;
using AutoMapper;

namespace PimsApi.Test.Controllers
{
    public class CodeLookupControllerTest
    {
        #region Variables
        private readonly LookupController _lookupController;
        private readonly PIMSContext _dbContext;
        private readonly IMapper _mapper;

        #endregion

        #region Constructors
        public CodeLookupControllerTest()
        {
            var logger = new Mock<ILogger<LookupController>>();
            var config = new Mock<IConfiguration>();
            var mapperConfig = new MapperConfiguration(cfg => {
                cfg.AddProfile(new CodeProfile());
            });
            _mapper = mapperConfig.CreateMapper();

            _dbContext = GetDatabaseContext();
            _lookupController = new LookupController(logger.Object, config.Object, _dbContext, _mapper);

            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim (ClaimTypes.NameIdentifier, Guid.NewGuid ().ToString ()),
                    new Claim (ClaimTypes.Role, "contributor")
            }, "mock"));
            _lookupController.ControllerContext = new ControllerContext()
            {
                HttpContext = new DefaultHttpContext() { User = user }
            };
        }
        #endregion

        #region Tests
        [Fact]
        public void GetAgencyCodes()
        {
            var Agency = new Entity.Agency
            {
                Code = "MOH",
                Name = "Ministry of Health",
                Description = "The Ministry of Health"
            };
            // Arrange
            _dbContext.Agencies.Add(Agency);
            _dbContext.SaveChanges();

            // Act
            var result = _lookupController.GetAgencies();
            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            Model.CodeModel[] resultValue = Assert.IsType<Model.CodeModel[]>(actionResult.Value);
            Assert.Equal(new[] { _mapper.Map<Model.CodeModel>(Agency) }, resultValue);
        }
        #endregion

        #region TestHelpers
        #endregion

        #region Methods
        private PIMSContext GetDatabaseContext()
        {
            var options = new DbContextOptionsBuilder<PIMSContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            var databaseContext = new PIMSContext(options);
            databaseContext.Database.EnsureCreated();
            return databaseContext;
        }
        #endregion
    }
}
