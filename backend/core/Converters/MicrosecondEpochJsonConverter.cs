using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Pims.Core.Converters
{
    /// <summary>
    /// MicrosecondEpochJsonConverter class, provides a way to convert unix timestamps into DateTime values and vise-versa.
    /// </summary>
    public class MicrosecondEpochJsonConverter : JsonConverter<DateTime>
    {
        #region Methods
        /// <summary>
        /// Read the 'long' value from JSON and return a DateTime.
        /// </summary>
        /// <param name="reader"></param>
        /// <param name="typeToConvert"></param>
        /// <param name="options"></param>
        /// <returns></returns>
        public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            long value;
            value = reader.TokenType switch
            {
                JsonTokenType.Number => reader.GetInt64(),
                JsonTokenType.String => Int64.TryParse(reader.GetString(), out long result) ? result : 0,
                _ => 0
            };
            return DateTimeOffset.UnixEpoch.AddSeconds(value).UtcDateTime;
        }

        /// <summary>
        /// Convert the DateTime to a long value.
        /// </summary>
        /// <param name="writer"></param>
        /// <param name="value"></param>
        /// <param name="options"></param>
        public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
        {
            long unixTime = ((DateTimeOffset)value).ToUnixTimeSeconds();
            writer.WriteNumberValue(unixTime);
        }
        #endregion
    }
}
