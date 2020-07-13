using Pims.Core.Converters;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Text;
using System.Text.Json;
using Xunit;

namespace Pims.Dal.Test.Core.Converters
{
    [Trait("category", "unit")]
    [Trait("category", "core")]
    [Trait("category", "function")]
    [ExcludeFromCodeCoverage]
    public class Int32ToStringJsonConverterTest
    {
        #region Data
        public static IEnumerable<object[]> WriteData = new List<object[]>()
        {
            new object[] { 1, "{\"test\":\"1\"}" },
            new object[] { null, "{\"test\":null}" }
        };

        public static IEnumerable<object[]> ReadData = new List<object[]>()
        {
            new object[] { JsonTokenType.String, "1", "1" },
            new object[] { JsonTokenType.String, "", "" },
            new object[] { JsonTokenType.String, "test", "test" },
            new object[] { JsonTokenType.String, null, null },
            new object[] { JsonTokenType.Number, null, null },
            new object[] { JsonTokenType.Number, 1, "1" },
            new object[] { JsonTokenType.Number, 0.34, "" },
            new object[] { JsonTokenType.True, true, null },
            new object[] { JsonTokenType.False, false, null },
        };
        #endregion

        #region Tests
        [Fact]
        public void CanConvert()
        {
            // Arrange
            var converter = new Int32ToStringJsonConverter();

            // Act
            var result = converter.CanConvert(typeof(string));

            // Assert
            Assert.True(result);
        }

        [Theory]
        [MemberData(nameof(WriteData))]
        public void Write(string value, string expectedResult)
        {
            // Arrange
            var options = new JsonSerializerOptions();
            using var stream = new MemoryStream();
            using var writer = new Utf8JsonWriter(stream);
            var converter = new Int32ToStringJsonConverter();

            writer.WriteStartObject();
            writer.WritePropertyName("test");

            // Act
            converter.Write(writer, value, options);

            // Assert
            writer.WriteEndObject();
            writer.Flush();
            var result = Encoding.UTF8.GetString(stream.ToArray());
            Assert.Equal(expectedResult, result);
        }

        [Theory]
        [MemberData(nameof(ReadData))]
        public void Read(JsonTokenType type, object value, string expectedResult)
        {
            // Arrange
            var options = new JsonSerializerOptions();

            var jsonUtf8Bytes = System.Text.Json.JsonSerializer.SerializeToUtf8Bytes(value, options);
            var reader = new Utf8JsonReader(jsonUtf8Bytes);
            var converter = new Int32ToStringJsonConverter();

            while (reader.Read())
            {
                if (reader.TokenType == type)
                    break;
            }

            // Act
            var result = converter.Read(ref reader, typeof(bool), options);

            // Assert
            Assert.Equal(expectedResult, result);
        }
        #endregion
    }
}
