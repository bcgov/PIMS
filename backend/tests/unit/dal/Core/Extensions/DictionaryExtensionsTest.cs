using Pims.Core.Extensions;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using Xunit;

namespace Pims.Api.Test.Core.Extensions
{
    [Trait("category", "unit")]
    [Trait("category", "core")]
    [Trait("category", "function")]
    [ExcludeFromCodeCoverage]
    public class DictionaryExtensionsTest
    {
        #region Tests
        #region GetIntValue
        [Fact]
        public void GetIntValue()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Id", "1" } };

            // Act
            var result = dict.GetIntValue("Id");

            // Assert
            Assert.Equal(1, result);
            Assert.IsType<int>(result);
        }

        [Fact]
        public void GetIntValue_Default()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Id", "test" } };

            // Act
            var result = dict.GetIntValue("Id");

            // Assert
            Assert.Equal(0, result);
            Assert.IsType<int>(result);
        }

        [Fact]
        public void GetIntValue_WithDefault()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Name", "1" } };

            // Act
            var result = dict.GetIntValue("Id", 1);

            // Assert
            Assert.Equal(1, result);
            Assert.IsType<int>(result);
        }

        [Fact]
        public void GetIntNullValue()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Id", "1" } };

            // Act
            var result = dict.GetIntNullValue("Id");

            // Assert
            Assert.Equal(1, result);
            Assert.IsType<int>(result);
        }

        [Fact]
        public void GetIntNullValue_Null()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Name", "1" } };

            // Act
            var result = dict.GetIntNullValue("Id");

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public void GetIntNullValue_Default()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Name", "1" } };

            // Act
            var result = dict.GetIntNullValue("Id");

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public void GetIntNullValue_WithDefault()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Name", "1" } };

            // Act
            var result = dict.GetIntNullValue("Id", 1);

            // Assert
            Assert.Equal(1, result);
            Assert.IsType<int>(result);
        }

        [Fact]
        public void GetIntArrayValue()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Ids", "1,2,3,4,5" } };

            // Act
            var result = dict.GetIntArrayValue("Ids");

            // Assert
            Assert.Equal(new[] { 1, 2, 3, 4, 5 }, result);
            Assert.IsType<int[]>(result);
        }

        [Fact]
        public void GetIntArrayValue_Separator()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Ids", "1;2;3;4;5" } };

            // Act
            var result = dict.GetIntArrayValue("Ids", ";");

            // Assert
            Assert.Equal(new[] { 1, 2, 3, 4, 5 }, result);
            Assert.IsType<int[]>(result);
        }

        [Fact]
        public void GetIntArrayValue_Empty()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Ids", "" } };

            // Act
            var result = dict.GetIntArrayValue("Ids");

            // Assert
            Assert.Equal(new int[0], result);
            Assert.IsType<int[]>(result);
        }

        [Fact]
        public void GetIntArrayValue_InvalidValues()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Ids", "1,,test,2" } };

            // Act
            var result = dict.GetIntArrayValue("Ids");

            // Assert
            Assert.Equal(new[] { 1, 2 }, result);
            Assert.IsType<int[]>(result);
        }

        [Fact]
        public void GetIntArrayValue_NotFound()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Name", "Value" } };

            // Act
            var result = dict.GetIntArrayValue("Ids");

            // Assert
            Assert.Equal(new int[0], result);
            Assert.IsType<int[]>(result);
        }
        #endregion

        #region GetFloatValue
        [Fact]
        public void GetFloatValue()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Id", "1.2" } };

            // Act
            var result = dict.GetFloatValue("Id");

            // Assert
            Assert.Equal(1.2f, result);
            Assert.IsType<float>(result);
        }

        [Fact]
        public void GetFloatValue_Default()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Name", "1.2" } };

            // Act
            var result = dict.GetFloatValue("Id");

            // Assert
            Assert.Equal(0f, result);
            Assert.IsType<float>(result);
        }

        [Fact]
        public void GetFloatValue_WithDefault()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Name", "1.2" } };

            // Act
            var result = dict.GetFloatValue("Id", 1.2f);

            // Assert
            Assert.Equal(1.2f, result);
            Assert.IsType<float>(result);
        }

        [Fact]
        public void GetFloatNullValue()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Id", "1.2" } };

            // Act
            var result = dict.GetFloatNullValue("Id");

            // Assert
            Assert.Equal(1.2f, result);
            Assert.IsType<float>(result);
        }

        [Fact]
        public void GetFloatNullValue_Null()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Name", "1.2" } };

            // Act
            var result = dict.GetFloatNullValue("Id");

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public void GetFloatNullValue_Default()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Name", "1.2" } };

            // Act
            var result = dict.GetFloatNullValue("Id");

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public void GetFloatNullValue_WithDefault()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Name", "1.2" } };

            // Act
            var result = dict.GetFloatNullValue("Id", 1.2f);

            // Assert
            Assert.Equal(1.2f, result);
            Assert.IsType<float>(result);
        }
        #endregion

        #region GetDecimalValue
        [Fact]
        public void GetDecimalValue()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Id", "1.2" } };

            // Act
            var result = dict.GetDecimalValue("Id");

            // Assert
            Assert.Equal(1.2m, result);
            Assert.IsType<decimal>(result);
        }

        [Fact]
        public void GetDecimalValue_Default()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Name", "1.2" } };

            // Act
            var result = dict.GetDecimalValue("Id");

            // Assert
            Assert.Equal(0m, result);
            Assert.IsType<decimal>(result);
        }

        [Fact]
        public void GetDecimalValue_WithDefault()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Name", "1.2" } };

            // Act
            var result = dict.GetDecimalValue("Id", 1.2m);

            // Assert
            Assert.Equal(1.2m, result);
            Assert.IsType<decimal>(result);
        }

        [Fact]
        public void GetDecimalNullValue()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Id", "1.2" } };

            // Act
            var result = dict.GetDecimalNullValue("Id");

            // Assert
            Assert.Equal(1.2m, result);
            Assert.IsType<decimal>(result);
        }

        [Fact]
        public void GetDecimalNullValue_Null()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Name", "1.2" } };

            // Act
            var result = dict.GetDecimalNullValue("Id");

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public void GetDecimalNullValue_Default()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Name", "1.2" } };

            // Act
            var result = dict.GetDecimalNullValue("Id");

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public void GetDecimalNullValue_WithDefault()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Name", "1.2" } };

            // Act
            var result = dict.GetDecimalNullValue("Id", 1.2m);

            // Assert
            Assert.Equal(1.2m, result);
            Assert.IsType<decimal>(result);
        }
        #endregion

        #region GetDoubleValue
        [Fact]
        public void GetDoubleValue()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Id", "1.2" } };

            // Act
            var result = dict.GetDoubleValue("Id");

            // Assert
            Assert.Equal(1.2d, result);
            Assert.IsType<double>(result);
        }

        [Fact]
        public void GetDoubleValue_Default()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Name", "1.2" } };

            // Act
            var result = dict.GetDoubleValue("Id");

            // Assert
            Assert.Equal(0d, result);
            Assert.IsType<double>(result);
        }

        [Fact]
        public void GetDoubleValue_WithDefault()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Name", "1.2" } };

            // Act
            var result = dict.GetDoubleValue("Id", 1.2d);

            // Assert
            Assert.Equal(1.2d, result);
            Assert.IsType<double>(result);
        }

        [Fact]
        public void GetDoubleNullValue()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Id", "1.2" } };

            // Act
            var result = dict.GetDoubleNullValue("Id");

            // Assert
            Assert.Equal(1.2d, result);
            Assert.IsType<double>(result);
        }

        [Fact]
        public void GetDoubleNullValue_Null()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Name", "1.2" } };

            // Act
            var result = dict.GetDoubleNullValue("Id");

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public void GetDoubleNullValue_Default()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Name", "1.2" } };

            // Act
            var result = dict.GetDoubleNullValue("Id");

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public void GetDoubleNullValue_WithDefault()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Name", "1.2" } };

            // Act
            var result = dict.GetDoubleNullValue("Id", 1.2d);

            // Assert
            Assert.Equal(1.2d, result);
            Assert.IsType<double>(result);
        }
        #endregion

        #region GetStringValue
        [Fact]
        public void GetStringValue()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Id", "1.2" } };

            // Act
            var result = dict.GetStringValue("Id");

            // Assert
            Assert.Equal("1.2", result);
            Assert.IsType<string>(result);
        }

        [Fact]
        public void GetStringValue_Default()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Name", "1.2" } };

            // Act
            var result = dict.GetStringValue("Id");

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public void GetStringValue_WithDefault()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Name", "1.2" } };

            // Act
            var result = dict.GetStringValue("Id", "1.2");

            // Assert
            Assert.Equal("1.2", result);
            Assert.IsType<string>(result);
        }

        [Fact]
        public void GetStringArrayValue()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Ids", "1,2,3,4,5" } };

            // Act
            var result = dict.GetStringArrayValue("Ids");

            // Assert
            Assert.Equal(new[] { "1", "2", "3", "4", "5" }, result);
            Assert.IsType<string[]>(result);
        }

        [Fact]
        public void GetStringArrayValue_Separator()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Ids", "1;2;3;4;5" } };

            // Act
            var result = dict.GetStringArrayValue("Ids", ";");

            // Assert
            Assert.Equal(new[] { "1", "2", "3", "4", "5" }, result);
            Assert.IsType<string[]>(result);
        }

        [Fact]
        public void GetStringArrayValue_Empty()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Ids", "" } };

            // Act
            var result = dict.GetStringArrayValue("Ids");

            // Assert
            Assert.Equal(new[] { "" }, result);
            Assert.IsType<string[]>(result);
        }

        [Fact]
        public void GetStringArrayValue_InvalidValues()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Ids", "1,,test,2" } };

            // Act
            var result = dict.GetStringArrayValue("Ids");

            // Assert
            Assert.Equal(new[] { "1", "", "test", "2" }, result);
            Assert.IsType<string[]>(result);
        }

        [Fact]
        public void GetStringArrayValue_NotFound()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Name", "Value" } };

            // Act
            var result = dict.GetStringArrayValue("Ids");

            // Assert
            Assert.Equal(new string[0], result);
            Assert.IsType<string[]>(result);
        }
        #endregion

        #region GetIntValue
        [Fact]
        public void GetValue_Int()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Id", "1" } };

            // Act
            var result = dict.GetValue<int>("Id");

            // Assert
            Assert.Equal(1, result);
            Assert.IsType<int>(result);
        }

        [Fact]
        public void GetValue_Int_Default()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Id", "test" } };

            // Act
            var result = dict.GetValue<int>("Id");

            // Assert
            Assert.Equal(0, result);
            Assert.IsType<int>(result);
        }

        [Fact]
        public void GetValue_Int_WithDefault()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Name", "1" } };

            // Act
            var result = dict.GetValue<int>("Id", 1);

            // Assert
            Assert.Equal(1, result);
            Assert.IsType<int>(result);
        }

        [Fact]
        public void GetValue_NullableBoolean()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Id", "true" } };

            // Act
            var result = dict.GetValue<bool?>("Id");

            // Assert
            Assert.True(result);
            Assert.IsType<bool>(result);
        }

        [Fact]
        public void GetValue_NullableBoolean_Default()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Name", "true" } };

            // Act
            var result = dict.GetValue<bool?>("Id");

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public void GetValue_NullableBoolean_WithDefault()
        {
            // Arrange
            var dict = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>() { { "Name", "true" } };

            // Act
            var result = dict.GetValue<bool?>("Id", true);

            // Assert
            Assert.True(result);
            Assert.IsType<bool>(result);
        }
        #endregion
        #endregion
    }
}
