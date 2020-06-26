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
    public class BooleanJsonConverterTest
    {
        #region Data
        public static IEnumerable<object[]> WriteData = new List<object[]>()
        {
            new object[] { true, "{\"test\":\"true\"}" },
            new object[] { false, "{\"test\":\"false\"}" }
        };

        public static IEnumerable<object[]> ReadData = new List<object[]>()
        {
            new object[] { "true", true },
            new object[] { "True", true },
            new object[] { "TRUE", true },
            new object[] { "false", false },
            new object[] { "False", false },
            new object[] { "FALSE", false }
        };
        #endregion

        #region Tests
        [Fact]
        public void CanConvert()
        {
            // Arrange
            var converter = new BooleanJsonConverter();

            // Act
            var result = converter.CanConvert(typeof(bool));

            // Assert
            Assert.True(result);
        }

        [Theory]
        [MemberData(nameof(WriteData))]
        public void Write(bool value, string expectedResult)
        {
            // Arrange
            var options = new JsonSerializerOptions();
            using var stream = new MemoryStream();
            using var writer = new Utf8JsonWriter(stream);
            var converter = new BooleanJsonConverter();

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
        public void Read(string value, bool expectedResult)
        {
            // Arrange
            var options = new JsonSerializerOptions();

            var jsonUtf8Bytes = System.Text.Json.JsonSerializer.SerializeToUtf8Bytes(value, options);
            var reader = new Utf8JsonReader(jsonUtf8Bytes);
            var converter = new BooleanJsonConverter();

            while (reader.Read())
            {
                if (reader.TokenType == JsonTokenType.String)
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
