using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Pims.Core.Converters
{
    public class Int32ToStringJsonConverter : JsonConverter<string>
    {
        #region Methods
        public override string Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return reader.TokenType switch
            {
                (JsonTokenType.String) => reader.GetString(),
                (JsonTokenType.Number) => reader.TryGetInt32(out int result) ? $"{result}" : "",
                _ => null,
            };
        }

        public override void Write(Utf8JsonWriter writer, string value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value);
        }
        #endregion
    }
}
