using Pims.Core.Extensions;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using Xunit;

namespace Pims.Api.Test.Core.Extensions
{
    [Trait("category", "unit")]
    [Trait("category", "core")]
    [Trait("category", "function")]
    [ExcludeFromCodeCoverage]
    public class CollectionExtensionsTest
    {
        #region Tests
        [Fact]
        public void JoinAll()
        {
            // Arrange
            var items = new Collection<dynamic> { new { Id = 1, Name = "test1" }, new { Id = 2, Name = "test2" }, new { Id = 3, Name = "test3" } };

            // Act
            var result = items.RemoveAll(i => i.Id == 1);

            // Assert
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<object>>(result);
            Assert.Equal(2, result.Count());
            Assert.True(result.First().Id == 2);
            Assert.Equal(result, items);
        }
        #endregion
    }
}
