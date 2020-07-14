using FluentAssertions;
using Pims.Core.Extensions;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using Xunit;
using CModel = Pims.Ches.Models;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Test.Core.Extensions
{
    [Trait("category", "unit")]
    [Trait("category", "core")]
    [Trait("category", "function")]
    [ExcludeFromCodeCoverage]
    public class EnumExtensionsTest
    {
        #region Data
        public static IEnumerable<object[]> EnumInData = new List<object[]>()
        {
            new object[] { Entity.NotificationEncodings.Utf8, new[] { Entity.NotificationEncodings.Utf8, Entity.NotificationEncodings.Hex }, true },
            new object[] { Entity.NotificationEncodings.Utf8, new[] { Entity.NotificationEncodings.Utf8 }, true },
            new object[] { Entity.NotificationEncodings.Utf8, new[] { Entity.NotificationEncodings.Binary, Entity.NotificationEncodings.Hex }, false },
            new object[] { Entity.NotificationEncodings.Utf8, new[] { Entity.NotificationEncodings.Binary }, false },
            new object[] { Entity.NotificationEncodings.Utf8, new Entity.NotificationEncodings[0], false },
        };
        #endregion

        #region Tests
        #region ToLower
        [Fact]
        public void Enum_ToLower()
        {
            // Arrange
            var encoding = Entity.NotificationEncodings.Utf8;

            // Act
            var result = encoding.ToLower();

            // Assert
            result.Should().Be("utf8");
        }
        #endregion

        #region In
        [Theory]
        [MemberData(nameof(EnumInData))]
        public void Enum_In(Entity.NotificationEncodings value, Entity.NotificationEncodings[] inValues, bool expectedResult)
        {
            // Arrange
            // Act
            var result = value.In(inValues);

            // Assert
            result.Should().Be(expectedResult);
        }
        #endregion

        #region ConvertTo
        [Fact]
        public void Enum_ConvertTo()
        {
            // Arrange
            var encoding = Entity.NotificationEncodings.Utf8;

            // Act
            var result = encoding.ConvertTo<Entity.NotificationEncodings, CModel.EmailEncodings>();

            // Assert
            result.Should().Be(CModel.EmailEncodings.Utf8);
        }
        #endregion
        #endregion
    }
}
