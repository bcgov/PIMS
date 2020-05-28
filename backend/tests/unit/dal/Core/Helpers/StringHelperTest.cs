using Pims.Core.Helpers;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using Xunit;

namespace Pims.Api.Test.Helpers
{
    [Trait("category", "unit")]
    [Trait("category", "core")]
    [Trait("category", "function")]
    [ExcludeFromCodeCoverage]
    public class StringHelperTest
    {
        #region Data
        public static IEnumerable<object[]> Data =>
            new List<object[]>
            {
                new object[] { 10 },
                new object[] { 15 }
            };
        #endregion

        #region Tests
        [Theory]
        [MemberData(nameof(Data))]
        public void Generate(int length)
        {
            // Arrange
            // Act
            var result = StringHelper.Generate(length);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<string>(result);
            Assert.Equal(length, result.Length);
        }

        [Theory]
        [MemberData(nameof(Data))]
        public void Generate_NoDuplicate(int length)
        {
            // Arrange
            // Act
            var result1 = StringHelper.Generate(length);
            var result2 = StringHelper.Generate(length);

            // Assert
            Assert.NotNull(result1);
            Assert.NotNull(result2);
            Assert.Equal(length, result1.Length);
            Assert.Equal(length, result2.Length);
            Assert.NotEqual(result1, result2);
        }

        [Fact]
        public void Generate_ArgumentException()
        {
            // Arrange
            // Act
            // Assert
            Assert.Throws<ArgumentException>(() => StringHelper.Generate(1));
        }
        #endregion
    }
}
