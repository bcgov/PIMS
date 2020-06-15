using FluentAssertions.Extensions;
using Pims.Core.Converters;
using System;
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
    public class MicrosecondEpochJsonConverterTest
    {
        #region Data
        private static readonly DateTimeOffset DATE = new DateTimeOffset(new DateTime(2020, 1, 1));
        private static readonly DateTimeOffset MIN_DATE = new DateTimeOffset(DateTime.MinValue);

        public static IEnumerable<object[]> WriteData = new List<object[]>()
        {
            new object[] { DATE, $"{{\"test\":{DATE.ToUnixTimeSeconds()}}}" },
            new object[] { null, $"{{\"test\":{MIN_DATE.ToUnixTimeSeconds()}}}" }
        };

        public static IEnumerable<object[]> ReadData = new List<object[]>()
        {
            new object[] { JsonTokenType.String, $"{DATE.ToUnixTimeSeconds()}", DATE },
            new object[] { JsonTokenType.String, "", DateTimeOffset.UnixEpoch },
            new object[] { JsonTokenType.String, "test", DateTimeOffset.UnixEpoch },
            new object[] { JsonTokenType.String, null, DateTimeOffset.UnixEpoch },
            new object[] { JsonTokenType.Number, null, DateTimeOffset.UnixEpoch },
            new object[] { JsonTokenType.Number, DATE.ToUnixTimeSeconds(), DATE },
            new object[] { JsonTokenType.True, true, DateTimeOffset.UnixEpoch },
            new object[] { JsonTokenType.False, false, DateTimeOffset.UnixEpoch },
        };
        #endregion

        #region Tests
        [Fact]
        public void CanConvert()
        {
            // Arrange
            var converter = new MicrosecondEpochJsonConverter();

            // Act
            var result = converter.CanConvert(typeof(DateTime));

            // Assert
            Assert.True(result);
        }

        [Theory]
        [MemberData(nameof(WriteData))]
        public void Write(DateTime value, string expectedResult)
        {
            // Arrange
            var options = new JsonSerializerOptions();
            using var stream = new MemoryStream();
            using var writer = new Utf8JsonWriter(stream);
            var converter = new MicrosecondEpochJsonConverter();

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
        public void Read(JsonTokenType type, object value, DateTimeOffset expectedResult)
        {
            // Arrange
            var options = new JsonSerializerOptions();

            var jsonUtf8Bytes = System.Text.Json.JsonSerializer.SerializeToUtf8Bytes(value, options);
            var reader = new Utf8JsonReader(jsonUtf8Bytes);
            var converter = new MicrosecondEpochJsonConverter();

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
