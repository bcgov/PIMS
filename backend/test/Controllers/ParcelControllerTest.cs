using Xunit;
using System.Security.Claims;
using System.Collections.Generic;
using Pims.Dal.Exceptions;
using Pims.Dal;
using Pims.Api.Test.Helpers;
using Pims.Api.Controllers;
using Moq;
using Model = Pims.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Entity = Pims.Dal.Entities;
using AutoMapper;
using Pims.Dal.Security;
using Pims.Dal.Entities.Models;

namespace Pims.Api.Test.Controllers
{
    public class ParcelControllerTest
    {
        #region Variables
        private static readonly int AGENCY_ID = 2;
        private static readonly int CLASSIFICATION_ID = 3;
        private readonly Entity.Parcel _expectedParcel = new Entity.Parcel()
        {
            Id = 1,
            Latitude = 50,
            Longitude = 25,
            RowVersion = new byte[] { 12, 13, 14 },
            AgencyId = AGENCY_ID,
            ClassificationId = CLASSIFICATION_ID
        };
        #endregion

        #region Constructors
        public ParcelControllerTest()
        {
        }
        #endregion

        #region Tests
        #region DeleteParcel
        [Fact]
        public void DeleteParcel_Success()
        {
            // Arrange
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyAdd);
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(user);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var testParcels = GetTestParcels(_expectedParcel);
            service.Setup(m => m.Parcel.Remove(It.IsAny<Entity.Parcel>()));
            service.Setup(m => m.Principal).Returns(user);
            var modelToDelete = mapper.Map<Model.ParcelModel>(_expectedParcel);

            // Act
            var result = controller.DeleteParcel(modelToDelete);

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            Model.ParcelModel actualParcel = Assert.IsType<Model.ParcelModel>(actionResult.Value);
            Assert.Equal(mapper.Map<Model.ParcelModel>(_expectedParcel), actualParcel);
            service.Verify(m => m.Parcel.Remove(It.IsAny<Entity.Parcel>()), Times.Once());
        }

        [Fact]
        public void DeleteParcel_NoClaim()
        {
            // Arrange
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(user);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var testParcels = GetTestParcels(_expectedParcel);
            service.Setup(m => m.Parcel.Remove(It.IsAny<Entity.Parcel>()));
            service.Setup(m => m.Principal).Returns((ClaimsPrincipal)null);
            service.Setup(m => m.Parcel.Remove(It.IsAny<Entity.Parcel>())).Throws<NotAuthorizedException>();
            var controller_context = helper.GetService<ControllerContext>();

            // Act
            // Assert
            Assert.Throws<NotAuthorizedException>(() =>
                controller.DeleteParcel(mapper.Map<Model.ParcelModel>(_expectedParcel)));
            service.Verify(m => m.Parcel.Remove(It.IsAny<Entity.Parcel>()), Times.Once());
        }
        #endregion

        #region GetParcels
        [Fact]
        public void GetParcels_FilterLatitude()
        {
            // Arrange
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(user);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var testParcels = GetTestParcels(_expectedParcel);
            var filter = new ParcelFilter(50, 25, 50, 20);
            service.Setup(m => m.Parcel.GetNoTracking(It.IsAny<ParcelFilter>())).Returns(new[] { _expectedParcel });

            // Act
            var result = controller.GetParcels(filter);

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            Model.Parts.ParcelModel[] actualParcels = Assert.IsType<Model.Parts.ParcelModel[]>(actionResult.Value);
            Assert.Equal(new Model.Parts.ParcelModel[] { mapper.Map<Model.Parts.ParcelModel>(_expectedParcel) }, actualParcels);
            service.Verify(m => m.Parcel.GetNoTracking(filter), Times.Once());
        }

        [Fact]
        public void GetParcels_FilterLongitude()
        {
            // Arrange
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(user);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var testParcels = GetTestParcels(_expectedParcel);
            var filter = new ParcelFilter(50, 25, 50, 25);
            service.Setup(m => m.Parcel.GetNoTracking(It.IsAny<ParcelFilter>())).Returns(new[] { _expectedParcel });

            // Act
            var result = controller.GetParcels(filter);

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            Model.Parts.ParcelModel[] actualParcels = Assert.IsType<Model.Parts.ParcelModel[]>(actionResult.Value);
            Assert.Equal(new Model.Parts.ParcelModel[] { mapper.Map<Model.Parts.ParcelModel>(_expectedParcel) }, actualParcels);
            service.Verify(m => m.Parcel.GetNoTracking(filter), Times.Once());
        }

        [Fact]
        public void GetParcels_FilterAgency()
        {
            // Arrange
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(user);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var testParcels = GetTestParcels(_expectedParcel);
            var filter = new ParcelFilter()
            {
                Agencies = new int[] { AGENCY_ID }
            };
            service.Setup(m => m.Parcel.GetNoTracking(It.IsAny<ParcelFilter>())).Returns(new[] { _expectedParcel });

            // Act
            var result = controller.GetParcels(filter);

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            Model.Parts.ParcelModel[] actualParcels = Assert.IsType<Model.Parts.ParcelModel[]>(actionResult.Value);
            Assert.Equal(new Model.Parts.ParcelModel[] { mapper.Map<Model.Parts.ParcelModel>(_expectedParcel) }, actualParcels);
            service.Verify(m => m.Parcel.GetNoTracking(filter), Times.Once());
        }

        [Fact]
        public void GetParcels_FilterClassification()
        {
            // Arrange
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(user);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var testParcels = GetTestParcels(_expectedParcel);
            var filter = new ParcelFilter()
            {
                ClassificationId = CLASSIFICATION_ID
            };
            service.Setup(m => m.Parcel.GetNoTracking(It.IsAny<ParcelFilter>())).Returns(new[] { _expectedParcel });

            // Act
            var result = controller.GetParcels(filter);

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            Model.Parts.ParcelModel[] actualParcels = Assert.IsType<Model.Parts.ParcelModel[]>(actionResult.Value);
            Assert.Equal(new Model.Parts.ParcelModel[] { mapper.Map<Model.Parts.ParcelModel>(_expectedParcel) }, actualParcels);
            service.Verify(m => m.Parcel.GetNoTracking(filter), Times.Once());
        }

        [Fact]
        public void GetParcels_GetMultiple()
        {
            // Arrange
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(user);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var testParcels = GetTestParcels(_expectedParcel);
            var filter = new ParcelFilter(100, 100, 0, 0);
            service.Setup(m => m.Parcel.GetNoTracking(It.IsAny<ParcelFilter>())).Returns(testParcels);

            // Act
            var result = controller.GetParcels(filter);

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            Model.Parts.ParcelModel[] actualParcels = Assert.IsType<Model.Parts.ParcelModel[]>(actionResult.Value);
            Model.Parts.ParcelModel[] expectedParcels = mapper.Map<Model.Parts.ParcelModel[]>(testParcels);
            Assert.Equal(expectedParcels, actualParcels);
            service.Verify(m => m.Parcel.GetNoTracking(filter), Times.Once());
        }

        [Fact]
        public void GetParcels_FilterAll()
        {
            // Arrange
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(user);

            var service = helper.GetService<Mock<IPimsService>>();
            var testParcels = GetTestParcels(_expectedParcel);
            var filter = new ParcelFilter(0, 25, 10, 20);
            service.Setup(m => m.Parcel.GetNoTracking(It.IsAny<ParcelFilter>())).Returns(new Entity.Parcel[0]);

            // Act
            var result = controller.GetParcels(filter);

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult>(result);
            Model.Parts.ParcelModel[] actualParcels = Assert.IsType<Model.Parts.ParcelModel[]>(actionResult.Value);
            Assert.Empty(actualParcels);
            service.Verify(m => m.Parcel.GetNoTracking(filter), Times.Once());
        }
        #endregion

        #region GetParcel
        [Fact]
        public void GetParcel_NoData()
        {
            // Arrange
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(user);
            var service = helper.GetService<Mock<IPimsService>>();
            service.Setup(m => m.Parcel.GetNoTracking(It.IsAny<int>())).Throws<KeyNotFoundException>();
            int expectedParcelId = 1;

            // Act
            // Assert
            Assert.Throws<KeyNotFoundException>(() =>
                controller.GetParcel(expectedParcelId));
            service.Verify(m => m.Parcel.GetNoTracking(expectedParcelId), Times.Once());
        }

        [Fact]
        public void GetParcel_NonMatchingId()
        {
            // Arrange
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(user);

            var service = helper.GetService<Mock<IPimsService>>();
            service.Setup(m => m.Parcel.GetNoTracking(It.IsAny<int>())).Throws<KeyNotFoundException>();
            int expectedParcelId = 1;

            // Act
            // Assert
            Assert.Throws<KeyNotFoundException>(() =>
                controller.GetParcel(expectedParcelId));
            service.Verify(m => m.Parcel.GetNoTracking(expectedParcelId), Times.Once());
        }

        [Fact]
        public void GetParcel_Matching()
        {
            // Arrange
            var user = PrincipalHelper.CreateForPermission(Permissions.PropertyView);
            var helper = new TestHelper();
            var controller = helper.CreateController<ParcelController>(user);

            var service = helper.GetService<Mock<IPimsService>>();
            var mapper = helper.GetService<IMapper>();
            var expectedTestParcel = new Entity.Parcel
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
                Agency = new Entity.Agency
                {
                    Id = 7,
                    Parent = new Entity.Agency
                    {
                        Id = 8
                    }
                }
            };
            service.Setup(m => m.Parcel.GetNoTracking(It.IsAny<int>())).Returns(expectedTestParcel);
            int expectedParcelId = 1;

            // Act
            var result = controller.GetParcel(expectedParcelId);

            // Assert
            var jsonResult = Assert.IsType<JsonResult>(result);
            Model.ParcelModel actualParcelDetail = Assert.IsType<Model.ParcelModel>(jsonResult.Value);
            Assert.Equal(mapper.Map<Model.ParcelModel>(expectedTestParcel), actualParcelDetail);
            service.Verify(m => m.Parcel.GetNoTracking(expectedParcelId), Times.Once());
        }

        #endregion
        #endregion

        #region TestHelpers
        private IEnumerable<Entity.Parcel> GetTestParcels(Entity.Parcel expectedParcel = null)
        {
            return new Entity.Parcel[] {
                expectedParcel,
                new Entity.Parcel()
                {
                    Id = 2,
                    Latitude = 50.1,
                    Longitude = 25
                },
                new Entity.Parcel()
                {
                    Id = 3,
                    Latitude = 49.9,
                    Longitude = 25
                }
            };
        }
        #endregion

        #region Methods
        #endregion
    }
}
