using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Pims.Core.Converters
{
    /// <summary>
    /// BooleanJsonConverter class, provides a json converter for boolean values.
    /// Converters boolean values into lowercase string.
    /// </summary>
    public class BooleanJsonConverter : JsonConverter<bool>
    {
        #region Methods
        /// <summary>
        /// Convert string into boolean, or default to false.
        /// </summary>
        /// <param name="reader"></param>
        /// <param name="typeToConvert"></param>
        /// <param name="options"></param>
        /// <returns></returns>
        public override bool Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            var value = reader.GetString();

            return Boolean.TryParse(value, out bool result) ? result : default;
        }

        /// <summary>
        /// Return boolean value as lowercase string [true, false].
        /// </summary>
        /// <param name="writer"></param>
        /// <param name="value"></param>
        /// <param name="options"></param>
        public override void Write(Utf8JsonWriter writer, bool value, JsonSerializerOptions options)
        {
            writer.WriteStringValue($"{value}".ToLower());
        }
        #endregion
    }
}
