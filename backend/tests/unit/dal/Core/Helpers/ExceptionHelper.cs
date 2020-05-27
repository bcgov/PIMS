using Pims.Core.Helpers;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using Xunit;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Test.Helpers
{
    [Trait("category", "unit")]
    [Trait("category", "core")]
    [Trait("category", "function")]
    [ExcludeFromCodeCoverage]
    public class ExceptionHelperTest
    {
        #region Data
        public static IEnumerable<object[]> Data =>
            new List<object[]>
            {
                new object[] { new[] { new { Id = 1, Name = "test1" }, new { Id = 2, Name = "test2" } }, 2 },
                new object[] { new[] { new Entity.TierLevel(1, "test1"), new Entity.TierLevel(2, "test2") }, 10 }
            };
        #endregion

        #region Tests
        [Fact]
        public void HandleKeyNotFound()
        {
            // Arrange
            static bool get() => throw new KeyNotFoundException();

            // Act
            var result = ExceptionHelper.HandleKeyNotFound(get);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void HandleKeyNotFound_Nullable()
        {
            // Arrange
            static bool? get() => throw new KeyNotFoundException();

            // Act
            var result = ExceptionHelper.HandleKeyNotFound(get);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public void HandleKeyNotFound_Object()
        {
            // Arrange
            static Entity.Parcel get() => throw new KeyNotFoundException();

            // Act
            var result = ExceptionHelper.HandleKeyNotFound(get);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public void HandleKeyNotFound_WithSetter()
        {
            // Arrange
            static bool get() => throw new KeyNotFoundException();
            static bool set() => true;

            // Act
            var result = ExceptionHelper.HandleKeyNotFound(get, set);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void HandleKeyNotFound_WithDefault()
        {
            // Arrange
            static bool get() => throw new KeyNotFoundException();

            // Act
            var result = ExceptionHelper.HandleKeyNotFound(get, true);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void HandleKeyNotFound_WithDefaultInstance()
        {
            // Arrange
            static Entity.Parcel get() => throw new KeyNotFoundException();

            // Act
            var result = ExceptionHelper.HandleKeyNotFoundWithDefault(get);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<Entity.Parcel>(result);
        }

        [Fact]
        public void HandleKeyNotFound_WithDefaultInstance_Primitive()
        {
            // Arrange
            static bool get() => throw new KeyNotFoundException();

            // Act
            var result = ExceptionHelper.HandleKeyNotFoundWithDefault(get);

            // Assert
            Assert.False(result);
            Assert.IsType<bool>(result);
        }
        #endregion
    }
}
