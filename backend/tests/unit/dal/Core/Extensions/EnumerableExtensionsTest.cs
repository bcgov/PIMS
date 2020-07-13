using FluentAssertions;
using Pims.Core.Extensions;
using System;
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
    public class EnumerableExtensionsTest
    {
        #region Data
        public static IEnumerable<object[]> NextData = new List<object[]>()
        {
            new object[] { 0, 1 },
            new object[] { 1, 2 },
            new object[] { 2, 3 }
        };
        #endregion

        #region Tests
        #region ForEach
        [Fact]
        public void Enumerable_ForEach()
        {
            // Arrange
            var list = new[] { 1, 2, 3 };

            // Act
            var result = 0;
            var iterations = 0;
            list.ForEach(v =>
            {
                result += v;
                iterations++;
            });

            // Assert
            result.Should().Be(6);
            iterations.Should().Be(list.Length);
        }

        [Fact]
        public void Enumerable_ForEach_WithIndex()
        {
            // Arrange
            var list = new[] { 1, 2, 3 };

            // Act
            var result = 0;
            var iterations = 0;
            var insideIndex = 0;
            list.ForEach((v, i) =>
            {
                result += v;
                iterations++;
                insideIndex = i;
            });

            // Assert
            result.Should().Be(6);
            iterations.Should().Be(list.Length);
            insideIndex.Should().Be(list.Length - 1);
        }
        #endregion

        #region Next
        [Theory]
        [MemberData(nameof(NextData))]
        public void Enumerable_Next(int index, int expectedResult)
        {
            // Arrange
            var list = new[] { 1, 2, 3 };

            // Act
            var result = list.Next(index);

            // Assert
            result.Should().Be(expectedResult);
        }

        [Fact]
        public void Enumerable_Next_IndexTooLow()
        {
            // Arrange
            var list = new[] { 1, 2, 3 };

            // Act
            // Assert
            Assert.Throws<ArgumentException>(() => list.Next(-1));
        }

        [Fact]
        public void Enumerable_Next_IndexTooHigh()
        {
            // Arrange
            var list = new[] { 1, 2, 3 };

            // Act
            // Assert
            Assert.Throws<InvalidOperationException>(() => list.Next(4));
        }

        [Fact]
        public void Enumerable_Next_Take()
        {
            // Arrange
            var list = new[] { 1, 2, 3 };

            // Act
            var results = list.Next(1, 2);

            // Assert
            Assert.IsAssignableFrom<IEnumerable<int>>(results);
            results.Should().HaveCount(2);
            results.First().Should().Be(2);
        }

        [Fact]
        public void Enumerable_Next_Take_IndexTooLow()
        {
            // Arrange
            var list = new[] { 1, 2, 3 };

            // Act
            // Assert
            Assert.Throws<ArgumentException>(() => list.Next(-1, 1));
        }

        [Fact]
        public void Enumerable_Next_Take_TakeTooLow()
        {
            // Arrange
            var list = new[] { 1, 2, 3 };

            // Act
            // Assert
            Assert.Throws<ArgumentException>(() => list.Next(1, 0));
        }

        [Fact]
        public void Enumerable_Next_TakeTooHigh()
        {
            // Arrange
            var list = new[] { 1, 2, 3 };

            // Act
            var results = list.Next(1, 4);

            // Assert
            Assert.IsAssignableFrom<IEnumerable<int>>(results);
            results.Should().HaveCount(2);
            results.First().Should().Be(2);
        }
        #endregion

        #region NotNull
        [Fact]
        public void Enumerable_NotNull()
        {
            // Arrange
            var list = new int?[] { 1, 2, null, 3 };

            // Act
            var results = list.NotNull();

            // Assert
            results.Should().HaveCount(3);
        }
        #endregion
        #endregion
    }
}
