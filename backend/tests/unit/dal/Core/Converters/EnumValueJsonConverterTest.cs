using Pims.Core.Converters;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Text;
using System.Text.Json;
using Xunit;
using Entity = Pims.Dal.Entities;

namespace Pims.Dal.Test.Core.Converters
{
    [Trait("category", "unit")]
    [Trait("category", "core")]
    [Trait("category", "function")]
    [ExcludeFromCodeCoverage]
    public class EnumValueJsonConverterTest
    {
        #region Data
        public static IEnumerable<object[]> WriteData = new List<object[]>()
        {
            new object[] { Entity.NotificationEncodings.Utf8, "{\"test\":\"utf-8\"}" },
            new object[] { Entity.NotificationEncodings.Base64, "{\"test\":\"base64\"}" }
        };

        public static IEnumerable<object[]> ReadData = new List<object[]>()
        {
            new object[] { "utf-8", Entity.NotificationEncodings.Utf8 },
            new object[] { "utf8", Entity.NotificationEncodings.Utf8 },
            new object[] { "Utf8", Entity.NotificationEncodings.Utf8 },
            new object[] { "UTF8", Entity.NotificationEncodings.Utf8 },
            new object[] { "base64", Entity.NotificationEncodings.Base64 },
            new object[] { "Base64", Entity.NotificationEncodings.Base64 },
            new object[] { "BASE64", Entity.NotificationEncodings.Base64 },
        };
        #endregion

        #region Tests
        [Fact]
        public void CanConvert()
        {
            // Arrange
            var converter = new EnumValueJsonConverter<Entity.NotificationEncodings>();

            // Act
            var result = converter.CanConvert(typeof(Entity.NotificationEncodings));

            // Assert
            Assert.True(result);
        }

        [Theory]
        [MemberData(nameof(WriteData))]
        public void Write(Entity.NotificationEncodings value, string expectedResult)
        {
            // Arrange
            var options = new JsonSerializerOptions();
            using var stream = new MemoryStream();
            using var writer = new Utf8JsonWriter(stream);
            var converter = new EnumValueJsonConverter<Entity.NotificationEncodings>();

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
        public void Read(string value, Entity.NotificationEncodings expectedResult)
        {
            // Arrange
            var options = new JsonSerializerOptions();

            var jsonUtf8Bytes = System.Text.Json.JsonSerializer.SerializeToUtf8Bytes(value, options);
            var reader = new Utf8JsonReader(jsonUtf8Bytes);
            var converter = new EnumValueJsonConverter<Entity.NotificationEncodings>();

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
