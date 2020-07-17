using Pims.Core.Comparers;
using Pims.Core.Test;
using System.Diagnostics.CodeAnalysis;
using Xunit;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Test.Helpers
{
    [Trait("category", "unit")]
    [Trait("category", "core")]
    [Trait("category", "function")]
    [ExcludeFromCodeCoverage]
    public class ShallowPropertyCompareTest
    {
        #region Tests
        [Fact]
        public void Equal_Identical()
        {
            // Arrange
            var parcel1 = EntityHelper.CreateParcel(1);

            var comparer = new ShallowPropertyCompare();

            // Act
            var result = comparer.Equals(parcel1, parcel1);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void Equal()
        {
            // Arrange
            var o1 = new { Id = 1, Name = "test", Items = new[] { new { Id = 2 } } };
            var o2 = new { Id = 1, Name = "test", Items = new[] { new { Id = 2 } } };

            var comparer = new ShallowPropertyCompare();

            // Act
            var result = comparer.Equals(o1, o2);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void Equal_DifferentObjects()
        {
            // Arrange
            var o1 = EntityHelper.CreatePropertyClassification("test");
            var o2 = new { Id = 1, Name = "test", IsVisible = true, IsDisabled = false, SortOrder = 0, o1.CreatedById, o1.CreatedOn, o1.UpdatedById, o1.UpdatedOn, o1.RowVersion };

            var comparer = new ShallowPropertyCompare();

            // Act
            var result = comparer.Equals(o1, o2);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void Not_Equal()
        {
            // Arrange
            var parcel1 = EntityHelper.CreateParcel(1);
            var parcel2 = EntityHelper.CreateParcel(1);

            var comparer = new ShallowPropertyCompare();

            // Act
            var result = comparer.Equals(parcel1, parcel2);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void Not_Equal_Null1()
        {
            // Arrange
            Entity.Parcel parcel1 = null;
            var parcel2 = EntityHelper.CreateParcel(1);

            var comparer = new ShallowPropertyCompare();

            // Act
            var result = comparer.Equals(parcel1, parcel2);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void Not_Equal_Null2()
        {
            // Arrange
            var parcel1 = EntityHelper.CreateParcel(1);
            Entity.Parcel parcel2 = null;

            var comparer = new ShallowPropertyCompare();

            // Act
            var result = comparer.Equals(parcel1, parcel2);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void Equal_WithDifferentCollection()
        {
            // Arrange
            var o1 = new { Id = 1, Name = "test", Items = new[] { new { Id = 2 }, new { Id = 3 } } };
            var o2 = new { Id = 1, Name = "test", Items = new[] { new { Id = 2 } } };

            var comparer = new ShallowPropertyCompare();

            // Act
            var result = comparer.Equals(o1, o2);

            // Assert
            Assert.True(result);
        }
        #endregion
    }
}
