using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Models;
using AutoMapper;
using Pims.Api.Controllers;
using Pims.Api.Test.Helpers;
using Pims.Dal;
using Pims.Dal.Entities;
using Pims.Dal.Exceptions;

namespace Pims.Api.Test.Controllers
{
    public class ParcelControllerTest
    {
        #region Variables
        private readonly TestHelper _helper;
        private readonly ParcelController _parcelController;
        private static readonly int AGENCY_ID = 2;
        private static readonly int CLASSIFICATION_ID = 3;
        private readonly Entity.Parcel _expectedParcel = new Entity.Parcel ()
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
        public ParcelControllerTest ()
        {
            var user = Pims.Api.Test.Helpers.PrincipalHelper.CreateForRole ("contributor");
            _helper = new TestHelper ();
            _helper.CreatePimsService ();
            _parcelController = _helper.CreateParcelController (user);
        }
        #endregion

        #region Tests
        #region DeleteMyParcels
        [Fact]
        public void DeleteMyParcels_Success ()
        {
            // Arrange
            var service = _helper.GetService<Mock<IPimsService>> ();
            var mapper = _helper.GetService<IMapper> ();
            Entity.Parcel[] testParcels = getTestParcels (_expectedParcel);
            service.Setup (m => m.Parcel.Remove (It.IsAny<Parcel> ()));

            var admin = Pims.Api.Test.Helpers.PrincipalHelper.CreateForRole ("administrator");
            service.Setup (m => m.Principal).Returns (admin);

            // Execute
            var modelToDelete = mapper.Map<Model.ParcelModel> (_expectedParcel);
            var result = _parcelController.DeleteMyParcels (modelToDelete);

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult> (result);
            Model.ParcelModel actualParcel = Assert.IsType<Model.ParcelModel> (actionResult.Value);
            Assert.Equal (mapper.Map<Model.ParcelModel> (_expectedParcel), actualParcel);
        }

        [Fact]
        public void DeleteMyParcels_NoClaim ()
        {
            // Arrange
            var service = _helper.GetService<Mock<IPimsService>> ();
            var mapper = _helper.GetService<IMapper> ();
            Entity.Parcel[] testParcels = getTestParcels (_expectedParcel);
            service.Setup (m => m.Parcel.Remove (It.IsAny<Parcel> ()));
            service.Setup (m => m.Principal).Returns ((ClaimsPrincipal) null);
            service.Setup (m => m.Parcel.Remove (It.IsAny<Parcel> ())).Throws<NotAuthorizedException> ();
            var controller_context = _helper.GetService<ControllerContext> ();

            // Act
            Assert.Throws<NotAuthorizedException> (() =>
                _parcelController.DeleteMyParcels (mapper.Map<Model.ParcelModel> (_expectedParcel)));
        }
        #endregion

        #region GetMyParcels
        [Fact]
        public void GetMyParcels_FilterLatitude ()
        {
            // Arrange
            var service = _helper.GetService<Mock<IPimsService>> ();
            var mapper = _helper.GetService<IMapper> ();
            Entity.Parcel[] testParcels = getTestParcels (_expectedParcel);
            service.Setup (m => m.Parcel.GetNoTracking (It.IsAny<double> (), It.IsAny<double> (), It.IsAny<double> (), It.IsAny<double> (), null, null)).Returns (new [] { _expectedParcel });

            // Act
            var result = _parcelController.GetMyParcels (50, 25, 50, 20);

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult> (result);
            Model.Parts.ParcelModel[] actualParcels = Assert.IsType<Model.Parts.ParcelModel[]> (actionResult.Value);
            Assert.Equal (new Model.Parts.ParcelModel[] { mapper.Map<Model.Parts.ParcelModel> (_expectedParcel) }, actualParcels);
        }

        [Fact]
        public void GetMyParcels_FilterLongitude ()
        {
            // Arrange
            var service = _helper.GetService<Mock<IPimsService>> ();
            var mapper = _helper.GetService<IMapper> ();
            Entity.Parcel[] testParcels = getTestParcels (_expectedParcel);
            service.Setup (m => m.Parcel.GetNoTracking (It.IsAny<double> (), It.IsAny<double> (), It.IsAny<double> (), It.IsAny<double> (), null, null)).Returns (new [] { _expectedParcel });

            // Act
            var result = _parcelController.GetMyParcels (50, 25, 50, 25);

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult> (result);
            Model.Parts.ParcelModel[] actualParcels = Assert.IsType<Model.Parts.ParcelModel[]> (actionResult.Value);
            Assert.Equal (new Model.Parts.ParcelModel[] { mapper.Map<Model.Parts.ParcelModel> (_expectedParcel) }, actualParcels);
        }

        [Fact]
        public void GetMyParcels_FilterAgency ()
        {
            // Arrange
            var service = _helper.GetService<Mock<IPimsService>> ();
            var mapper = _helper.GetService<IMapper> ();
            Entity.Parcel[] testParcels = getTestParcels (_expectedParcel);
            service.Setup (m => m.Parcel.GetNoTracking (It.IsAny<double> (), It.IsAny<double> (), It.IsAny<double> (), It.IsAny<double> (), It.IsAny<int?> (), null)).Returns (new [] { _expectedParcel });

            // Act
            var result = _parcelController.GetMyParcels (100, 100, 0, 0, agencyId : AGENCY_ID);

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult> (result);
            Model.Parts.ParcelModel[] actualParcels = Assert.IsType<Model.Parts.ParcelModel[]> (actionResult.Value);
            Assert.Equal (new Model.Parts.ParcelModel[] { mapper.Map<Model.Parts.ParcelModel> (_expectedParcel) }, actualParcels);
        }

        [Fact]
        public void GetMyParcels_FilterClassification ()
        {
            // Arrange
            var service = _helper.GetService<Mock<IPimsService>> ();
            var mapper = _helper.GetService<IMapper> ();
            Entity.Parcel[] testParcels = getTestParcels (_expectedParcel);
            service.Setup (m => m.Parcel.GetNoTracking (It.IsAny<double> (), It.IsAny<double> (), It.IsAny<double> (), It.IsAny<double> (), It.IsAny<int?> (), It.IsAny<int?> ())).Returns (new [] { _expectedParcel });

            // Act
            var result = _parcelController.GetMyParcels (100, 100, 0, 0, null, propertyClassificationId : CLASSIFICATION_ID);

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult> (result);
            Model.Parts.ParcelModel[] actualParcels = Assert.IsType<Model.Parts.ParcelModel[]> (actionResult.Value);
            Assert.Equal (new Model.Parts.ParcelModel[] { mapper.Map<Model.Parts.ParcelModel> (_expectedParcel) }, actualParcels);
        }

        [Fact]
        public void GetMyParcels_GetMultiple ()
        {
            // Arrange
            var service = _helper.GetService<Mock<IPimsService>> ();
            var mapper = _helper.GetService<IMapper> ();
            Entity.Parcel[] testParcels = getTestParcels (_expectedParcel);
            service.Setup (m => m.Parcel.GetNoTracking (It.IsAny<double> (), It.IsAny<double> (), It.IsAny<double> (), It.IsAny<double> (), It.IsAny<int?> (), It.IsAny<int?> ())).Returns (testParcels);

            // Act
            var result = _parcelController.GetMyParcels (100, 100, 0, 0);

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult> (result);
            Model.Parts.ParcelModel[] actualParcels = Assert.IsType<Model.Parts.ParcelModel[]> (actionResult.Value);
            Model.Parts.ParcelModel[] expectedParcels = mapper.Map<Model.Parts.ParcelModel[]> (testParcels);
            Assert.Equal (expectedParcels, actualParcels);
        }

        [Fact]
        public void GetMyParcels_FilterAll ()
        {
            // Arrange
            var service = _helper.GetService<Mock<IPimsService>> ();
            Entity.Parcel[] testParcels = getTestParcels (_expectedParcel);
            service.Setup (m => m.Parcel.GetNoTracking (It.IsAny<double> (), It.IsAny<double> (), It.IsAny<double> (), It.IsAny<double> (), It.IsAny<int?> (), It.IsAny<int?> ())).Returns (new Parcel[0]);

            // Act
            var result = _parcelController.GetMyParcels (0, 25, 10, 20);

            // Assert
            JsonResult actionResult = Assert.IsType<JsonResult> (result);
            Model.Parts.ParcelModel[] actualParcels = Assert.IsType<Model.Parts.ParcelModel[]> (actionResult.Value);
            Assert.Empty (actualParcels);
        }
        #endregion

        #region GetMyParcelDetail
        [Fact]
        public void GetMyParcelDetail_NoData ()
        {
            // Act
            int expectedParcelId = 1;
            var actualParcelDetail = _parcelController.GetMyParcel (expectedParcelId);

            // Assert
            Assert.IsType<NoContentResult> (actualParcelDetail);
        }

        [Fact]
        public void GetMyParcelDetail_NonMatchingId ()
        {
            // Arrange
            var service = _helper.GetService<Mock<IPimsService>> ();
            Entity.Parcel expectedTestParcel = new Entity.Parcel
            {
                Id = 2
            };
            service.Setup (m => m.Parcel.GetNoTracking (It.IsAny<int> ())).Returns ((Parcel) null);

            // Act
            int expectedParcelId = 1;
            var actualParcelDetail = _parcelController.GetMyParcel (expectedParcelId);

            // Assert
            Assert.IsType<NoContentResult> (actualParcelDetail);
        }

        [Fact]
        public void GetMyParcelDetail_Matching ()
        {
            // Arrange
            var service = _helper.GetService<Mock<IPimsService>> ();
            var mapper = _helper.GetService<IMapper> ();
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
                Agency = new Entity.Agency
                {
                Id = 7,
                Parent = new Entity.Agency
                {
                Id = 8
                }
                },
                Buildings = new Entity.Building[0]

            };
            service.Setup (m => m.Parcel.GetNoTracking (It.IsAny<int> ())).Returns (expectedTestParcel);

            // Act
            int expectedParcelId = 1;
            var result = _parcelController.GetMyParcel (expectedParcelId);

            // Assert
            var jsonResult = Assert.IsType<JsonResult> (result);
            Model.ParcelModel actualParcelDetail = Assert.IsType<Model.ParcelModel> (jsonResult.Value);
            Assert.Equal (mapper.Map<Model.ParcelModel> (expectedTestParcel), actualParcelDetail);
        }

        #endregion
        #endregion

        #region TestHelpers
        private Entity.Parcel[] getTestParcels (Entity.Parcel expectedParcel = null)
        {
            Entity.Parcel parcel2 = new Entity.Parcel ()
            {
            Id = 2,
            Latitude = 50.1,
            Longitude = 25
            };
            Entity.Parcel parcel3 = new Entity.Parcel ()
            {
                Id = 3,
                Latitude = 49.9,
                Longitude = 25
            };
            return new Entity.Parcel[] { expectedParcel, parcel2, parcel3 };
        }
        #endregion

        #region Methods
        #endregion
    }
}
