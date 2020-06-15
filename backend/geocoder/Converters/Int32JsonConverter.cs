using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Pims.Geocoder.Converters
{
    public class Int32JsonConverter : JsonConverter<int?>
    {
        #region Methods
        public override int? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return reader.TryGetInt32(out int result) ? result : default;
        }

        public override void Write(Utf8JsonWriter writer, int? value, JsonSerializerOptions options)
        {
            writer.WriteStringValue($"{value}");
        }
        #endregion
    }
}
