using System;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Pims.Api.Controllers;
using Pims.Dal;
using Xunit;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Models;
using Pims.Dal.Services;
using Pims.Dal.Services.Concrete;
using Pims.Api.Helpers.Profiles;
using AutoMapper;

namespace PimsApi.Test.Controllers
{
    public class ParcelControllerTest
    {
        #region Variables
        private readonly ParcelController _parcelController;
        private readonly PIMSContext _dbContext;
        private readonly IParcelService _parcelService;
        private readonly IMapper _mapper;
        private readonly ILogger<ParcelController> _logger;
        private readonly IConfiguration _config;
        private readonly ClaimsPrincipal _user;
        private readonly Entity.Parcel _expectedParcel = new Entity.Parcel()
        {
            Id = 1,
            Latitude = 50,
            Longitude = 25,
            RowVersion = new byte[] {12, 13, 14}
        };

        #endregion

        #region Constructors
        public ParcelControllerTest()
        {
            _logger = new Mock<ILogger<ParcelController>>().Object;
            _config = new Mock<IConfiguration>().Object;
            var mapperConfig = new MapperConfiguration(cfg => {
                cfg.AddProfile(new ParcelProfile());
                cfg.AddProfile(new AddressProfile());
                cfg.AddProfile(new BuildingProfile());
                cfg.AddProfile(new BaseProfile());
            });
            _mapper = mapperConfig.CreateMapper();
            _dbContext = GetDatabaseContext();
            _user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim (ClaimTypes.NameIdentifier, Guid.NewGuid ().ToString ()),
                    new Claim (ClaimTypes.Role, "contributor")
            }, "mock"));
            _parcelService = new ParcelService(_dbContext, _user);
            _parcelController = new ParcelController(_logger, _config, _parcelService, _mapper);
            _parcelController.ControllerContext = new ControllerContext()
            {
                HttpContext = new DefaultHttpContext() { User = _user }
            };
        }
        #endregion

        #region Tests
        #region DeleteMyParcels
        [Fact]
        public void DeleteMyParcels_Success()
        {
            // Arrange
            Entity.Parcel[] testParcels = getTestParcels(_expectedParcel);
            _dbContext.Parcels.AddRange(testParcels);
            _dbContext.SaveChanges();

            // Execute
            var parcelController = GetParcelControllerForAdmin();
            var modelToDelete = _mapper.Map<Model.ParcelModel>(_expectedParcel);
            var result = parcelController.DeleteMyParcels(modelToDelete);

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            Model.ParcelModel actualParcel = Assert.IsType<Model.ParcelModel>(actionResult.Value);
            Assert.Equal(_mapper.Map<Model.ParcelModel>(_expectedParcel), actualParcel);
        }

        [Fact]
        public void DeleteMyParcels_NoClaim()
        {
            // Arrange
            Entity.Parcel[] testParcels = getTestParcels(_expectedParcel);
            _dbContext.Parcels.AddRange(testParcels);
            _dbContext.SaveChanges();

            // Act
            Assert.Throws<UnauthorizedAccessException>(() =>
             _parcelController.DeleteMyParcels(_mapper.Map<Model.ParcelModel>(_expectedParcel)));
        }
        #endregion

        #region GetMyParcels

        [Fact]
        public void GetMyParcels_FilterLatitude()
        {
            // Arrange
            Entity.Parcel[] testParcels = getTestParcels(_expectedParcel);
            _dbContext.Parcels.AddRange(testParcels);
            _dbContext.SaveChanges();

            // Act
            var result = _parcelController.GetMyParcels(50, 25, 50, 20);

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            Model.Parts.ParcelModel[] actualParcels = Assert.IsType<Model.Parts.ParcelModel[]>(actionResult.Value);
            Assert.Equal(new Model.Parts.ParcelModel[] { _mapper.Map<Model.Parts.ParcelModel>(_expectedParcel) }, actualParcels);
        }

        [Fact]
        public void GetMyParcels_FilterLongitude()
        {
            // Arrange
            Entity.Parcel[] testParcels = getTestParcels(_expectedParcel);
            _dbContext.Parcels.AddRange(testParcels);
            _dbContext.SaveChanges();

            // Act
            var result = _parcelController.GetMyParcels(50, 25, 50, 25);

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            Model.Parts.ParcelModel[] actualParcels = Assert.IsType<Model.Parts.ParcelModel[]>(actionResult.Value);
            Assert.Equal(new Model.Parts.ParcelModel[] { _mapper.Map<Model.Parts.ParcelModel>(_expectedParcel) }, actualParcels);
        }

        [Fact]
        public void GetMyParcels_GetMultiple()
        {
            // Arrange
            Entity.Parcel[] testParcels = getTestParcels(_expectedParcel);
            _dbContext.Parcels.AddRange(testParcels);
            _dbContext.SaveChanges();

            // Act
            var result = _parcelController.GetMyParcels(100, 100, 0, 0);

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            Model.Parts.ParcelModel[] actualParcels = Assert.IsType<Model.Parts.ParcelModel[]>(actionResult.Value);
            Model.Parts.ParcelModel[] expectedParcels = _mapper.Map<Model.Parts.ParcelModel[]>(testParcels);
            Assert.Equal(expectedParcels, actualParcels);
        }

        [Fact]
        public void GetMyParcels_FilterAll()
        {
            // Arrange
            Entity.Parcel[] testParcels = getTestParcels(_expectedParcel);
            _dbContext.Parcels.AddRange(testParcels);
            _dbContext.SaveChanges();

            // Act
            var result = _parcelController.GetMyParcels(0, 25, 10, 20);

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            Model.Parts.ParcelModel[] actualParcels = Assert.IsType<Model.Parts.ParcelModel[]>(actionResult.Value);
            Assert.Empty(actualParcels);
        }
        #endregion
        #region GetMyParcelDetail
        [Fact]
        public void GetMyParcelDetail_NoData()
        {
            // Act
            int expectedParcelId = 1;
            var actualParcelDetail = _parcelController.GetMyParcel(expectedParcelId);

            // Assert
            Assert.IsType<NoContentResult>(actualParcelDetail);
        }

        [Fact]
        public void GetMyParcelDetail_NonMatchingId()
        {
            // Arrange
            Entity.Parcel expectedTestParcel = new Entity.Parcel
            {
                Id = 2
            };
            _dbContext.Parcels.Add(expectedTestParcel);
            _dbContext.SaveChanges();

            // Act
            int expectedParcelId = 1;
            var actualParcelDetail = _parcelController.GetMyParcel(expectedParcelId);

            // Assert
            Assert.IsType<NoContentResult>(actualParcelDetail);
        }

        [Fact]
        public void GetMyParcelDetail_Matching()
        {
            Entity.Parcel expectedTestParcel = new Entity.Parcel
            {
                Id = 1,
                Status = new Entity.PropertyStatus
                {
                    Id = 2
                },
                Classification = new Entity.PropertyClassification
                {
                    Id = 3
                },
                Address = new Entity.Address
                {
                    Id = 4,
                    City = new Entity.City
                    {
                        Id = 5
                    },
                    Province = new Entity.Province
                    {
                        Id = "6"
                    }
                },
                Agency = new Entity.Agency {
                    Id = 7,
                    Parent = new Entity.Agency
                    {
                        Id = 8
                    }
                },
                Buildings = new Entity.Building[0]

            };
            _dbContext.Parcels.Add(expectedTestParcel);
            _dbContext.SaveChanges();

            // Act
            int expectedParcelId = 1;
            var result = _parcelController.GetMyParcel(expectedParcelId);

            // Assert
            var jsonResult = Assert.IsType<JsonResult>(result);
            Model.ParcelModel actualParcelDetail = Assert.IsType<Model.ParcelModel>(jsonResult.Value);
            Assert.Equal(_mapper.Map<Model.ParcelModel>(expectedTestParcel), actualParcelDetail);
        }

        #endregion
        #endregion

        #region TestHelpers
        private Entity.Parcel[] getTestParcels(Entity.Parcel expectedParcel = null)
        {
            Entity.Parcel parcel2 = new Entity.Parcel()
            {
                Id = 2,
                Latitude = 50.1,
                Longitude = 25
            };
            Entity.Parcel parcel3 = new Entity.Parcel()
            {
                Id = 3,
                Latitude = 49.9,
                Longitude = 25
            };
            return new Entity.Parcel[] { expectedParcel, parcel2, parcel3 };
        }
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

        private ParcelController GetParcelControllerForAdmin()
        {
            ClaimsPrincipal adminUser = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
{
                new Claim (ClaimTypes.NameIdentifier, Guid.NewGuid ().ToString ()),
                    new Claim (ClaimTypes.Role, "administrator")}, "mock"));
            var parcelService = new ParcelService(_dbContext, adminUser);

            return new ParcelController(_logger, _config, parcelService, _mapper);
        }
        #endregion
    }
}
