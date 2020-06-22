using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Pims.Geocoder.Converters
{
    public class BooleanJsonConverter : JsonConverter<bool>
    {
        #region Methods
        public override bool Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            var value = reader.GetString();

            return Boolean.TryParse(value, out bool result) ? result : default;
        }

        public override void Write(Utf8JsonWriter writer, bool value, JsonSerializerOptions options)
        {
            writer.WriteStringValue($"{value}");
        }
        #endregion
    }
}
