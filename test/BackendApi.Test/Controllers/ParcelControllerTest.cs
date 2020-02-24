using System;
using System.Security.Claims;
using Pims.Api.Controllers;
using Pims.Api.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using Pims.Api.Helpers.Profiles;
using Entity = Pims.Api.Data.Entities;
using Model = Pims.Api.Models;
using MapperModel = Pims.Api.Areas.Admin.Models;
using System.Linq;
using AutoMapper;

namespace PimsApi.Test.Controllers
{
    public class ParcelControllerTest
    {
        #region Variables
        private readonly ParcelController _parcelController;
        private readonly PIMSContext _dbContext;
        private readonly IMapper _mapper;
        private static readonly int AGENCY_ID = 2;
        private static readonly int CLASSIFICATION_ID = 3;
        private readonly Entity.Parcel _expectedParcel = new Entity.Parcel()
        {
            Id = 1,
            Latitude = 50,
            Longitude = 25,
            AgencyId = AGENCY_ID,
            ClassificationId = CLASSIFICATION_ID
        };

        #endregion

        #region Constructors
        public ParcelControllerTest()
        {
            var logger = new Mock<ILogger<ParcelController>>();
            var config = new Mock<IConfiguration>();
            _dbContext = GetDatabaseContext();
            var mapperConfig = new MapperConfiguration(cfg => {
                cfg.AddProfile(new ParcelProfile());
            });
            _mapper = mapperConfig.CreateMapper();

            _parcelController = new ParcelController(logger.Object, config.Object, _dbContext, _mapper);

            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim (ClaimTypes.NameIdentifier, Guid.NewGuid ().ToString ()),
                    new Claim (ClaimTypes.Role, "contributor")
            }, "mock"));
            _parcelController.ControllerContext = new ControllerContext()
            {
                HttpContext = new DefaultHttpContext() { User = user }
            };
        }
        #endregion

        #region Tests
        #region GetMyParcels
        [Fact]
        public void GetMyParcels()
        {
            // Arrange
            _dbContext.Parcels.Add(_expectedParcel);
            _dbContext.SaveChanges();

            // Act
            var result = _parcelController.GetMyParcels();

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            Model.Parcel[] resultValue = Assert.IsType<Model.Parcel[]>(actionResult.Value);
            Assert.Equal(new Model.Parcel[] { new Model.Parcel(_expectedParcel) }, resultValue);
        }

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
            Model.Parcel[] actualParcels = Assert.IsType<Model.Parcel[]>(actionResult.Value);
            Assert.Equal(new Model.Parcel[] { new Model.Parcel(_expectedParcel) }, actualParcels);
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
            Model.Parcel[] actualParcels = Assert.IsType<Model.Parcel[]>(actionResult.Value);
            Assert.Equal(new Model.Parcel[] { new Model.Parcel(_expectedParcel) }, actualParcels);
        }

        [Fact]
        public void GetMyParcels_FilterAgency()
        {
            // Arrange
            Entity.Parcel[] testParcels = getTestParcels(_expectedParcel);
            _dbContext.Parcels.AddRange(testParcels);
            _dbContext.SaveChanges();

            // Act
            var result = _parcelController.GetMyParcels(agencyId: AGENCY_ID);

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            Model.Parcel[] actualParcels = Assert.IsType<Model.Parcel[]>(actionResult.Value);
            Assert.Equal(new Model.Parcel[] { new Model.Parcel(_expectedParcel) }, actualParcels);
        }

        [Fact]
        public void GetMyParcels_FilterClassification()
        {
            // Arrange
            Entity.Parcel[] testParcels = getTestParcels(_expectedParcel);
            _dbContext.Parcels.AddRange(testParcels);
            _dbContext.SaveChanges();

            // Act
            var result = _parcelController.GetMyParcels(propertyClassificationId: CLASSIFICATION_ID);

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            Model.Parcel[] actualParcels = Assert.IsType<Model.Parcel[]>(actionResult.Value);
            Assert.Equal(new Model.Parcel[] { new Model.Parcel(_expectedParcel) }, actualParcels);
        }

        [Fact]
        public void GetMyParcels_MissingParam()
        {
            // Arrange
            _dbContext.Parcels.Add(_expectedParcel);
            _dbContext.SaveChanges();

            // Act
            var result = _parcelController.GetMyParcels(0, 0, 0, null);

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            Model.Parcel[] actualParcels = Assert.IsType<Model.Parcel[]>(actionResult.Value);
            Assert.Equal(new Model.Parcel[] { new Model.Parcel(_expectedParcel) }, actualParcels);
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
            Model.Parcel[] actualParcels = Assert.IsType<Model.Parcel[]>(actionResult.Value);
            Model.Parcel[] expectedParcels = testParcels.Select(parcel => new Model.Parcel(parcel)).ToArray();
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
            Model.Parcel[] actualParcels = Assert.IsType<Model.Parcel[]>(actionResult.Value);
            Assert.Empty(actualParcels);
        }

        [Fact]
        public void GetMyParcels_NoData()
        {
            // Act
            var result = _parcelController.GetMyParcels();

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            Model.Parcel[] actualParcels = Assert.IsType<Model.Parcel[]>(actionResult.Value);
            Assert.Empty(actualParcels);
        }
        #endregion
        #region GetMyParcelDetail
        [Fact]
        public void GetMyParcelDetail_NoData()
        {
            // Act
            int expectedParcelId = 1;
            var actualParcelDetail = _parcelController.GetMyParcels(expectedParcelId);

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
            var actualParcelDetail = _parcelController.GetMyParcels(expectedParcelId);

            // Assert
            Assert.IsType<NoContentResult>(actualParcelDetail);
        }

        [Fact]
        public void GetMyParcelDetail_Matching()
        {
            Entity.Parcel expectedTestParcel = new Entity.Parcel
            {
                Id = 1
            };
            _dbContext.Parcels.Add(expectedTestParcel);
            _dbContext.SaveChanges();

            // Act
            int expectedParcelId = 1;
            var result = _parcelController.GetMyParcels(expectedParcelId);

            // Assert
            var jsonResult = Assert.IsType<JsonResult>(result);
            MapperModel.ParcelModel actualParcelDetail = Assert.IsType<MapperModel.ParcelModel> (jsonResult.Value);
            Assert.Equal(_mapper.Map<MapperModel.ParcelModel>(expectedTestParcel).Id, actualParcelDetail.Id);
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
        #endregion
    }
}
