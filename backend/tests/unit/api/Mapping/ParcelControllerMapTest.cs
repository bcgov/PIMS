using Pims.Core.Test;
using System.Diagnostics.CodeAnalysis;
using Xunit;
using Model = Pims.Api.Models.Parcel;

namespace PimsApi.Test.Controllers
{
    [Trait("category", "unit")]
    [Trait("category", "mapping")]
    [Trait("group", "parcel")]
    [ExcludeFromCodeCoverage]
    public class ParcelControllerMapTest
    {
        #region Constructors
        public ParcelControllerMapTest()
        {
        }
        #endregion

        #region Tests
        #region UserInfo
        [Fact]
        public void ParcelModelMapping()
        {
            // Arrange
            var helper = new TestHelper();
            var mapper = helper.GetMapper();
            var parcel = EntityHelper.CreateParcel(99);
            parcel.Location.Y = 1;
            parcel.Location.X = 1;

            // Act
            var result = mapper.Map<Model.ParcelModel>(parcel);

            // Assert
            Assert.Equal(99, result.Id);
            Assert.Equal(1, result.Latitude);
            Assert.Equal(1, result.Longitude);
            Assert.Equal("description-99", result.Description);
            Assert.Equal(1, result.ClassificationId);
            Assert.Equal(1, result.AgencyId);
            // TODO: test all other properties.
        }
        #endregion
        #endregion
    }
}
