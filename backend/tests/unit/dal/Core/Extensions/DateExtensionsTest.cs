using FluentAssertions;
using Pims.Core.Extensions;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using Xunit;

namespace Pims.Api.Test.Core.Extensions
{
    [Trait("category", "unit")]
    [Trait("category", "core")]
    [Trait("category", "function")]
    [ExcludeFromCodeCoverage]
    public class DateExtensionsTest
    {
        #region Data
        public static IEnumerable<object[]> DateData = new List<object[]>()
        {
            new object[] { new DateTime(2019, 12, 31), 2020 },
            new object[] { new DateTime(2020, 1, 1), 2020 },
            new object[] { new DateTime(2020, 3, 30), 2020 },
            new object[] { new DateTime(2020, 4, 1), 2021 }
        };
        #endregion

        #region Tests
        #region GetFiscalYear
        [Theory]
        [MemberData(nameof(DateData))]
        public void Date_GetFiscalYear(DateTime value, int expectedResult)
        {
            // Arrange
            // Act
            var result = value.GetFiscalYear();

            // Assert
            result.Should().Be(expectedResult);
        }
        #endregion
        #endregion
    }
}
