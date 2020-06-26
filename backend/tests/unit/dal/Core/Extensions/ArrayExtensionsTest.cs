using Pims.Core.Extensions;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using Xunit;

namespace Pims.Api.Test.Core.Extensions
{
    [Trait("category", "unit")]
    [Trait("category", "core")]
    [Trait("category", "function")]
    [ExcludeFromCodeCoverage]
    public class ArrayExtensionsTest
    {
        #region Tests
        [Fact]
        public void JoinAll()
        {
            // Arrange
            var items1 = new[] { new { Id = 1, Name = "test1" }, new { Id = 2, Name = "test2" }, new { Id = 3, Name = "test3" } };
            var items2 = new[] { new { Id = 4, Name = "test4" } };
            var items3 = new[] { new { Id = 5, Name = "test5" } };

            // Act
            var result = items1.JoinAll(items2, items3);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<object>>(result);
            Assert.Equal(5, result.Count());
        }
        #endregion
    }
}
