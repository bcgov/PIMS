using Pims.Core.Json;
using System;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Pims.Core.Converters
{
    /// <summary>
    /// Converter to convert enums to and from strings.
    /// Handles enum values that have 'EnumValueAttribute' to define valid values.
    /// </summary>
    public sealed class JsonEnumValueConverter : JsonConverterFactory
    {
        private readonly JsonStringEnumConverter _converter;

        /// <summary>
        /// Creates a new instance of a JsonEnumValueConverter, initializes with specified arguments.
        /// </summary>
        /// <param name="namingPolicy"></param>
        /// <param name="allowIntegerValues"></param>
        public JsonEnumValueConverter(JsonNamingPolicy namingPolicy = null, bool allowIntegerValues = true)
        {
            _converter = new JsonStringEnumConverter(namingPolicy, allowIntegerValues);
        }

        /// <summary>
        /// Only can convert enum type.
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public override bool CanConvert(Type type)
        {
            return type.IsEnum;
        }

        /// <summary>
        /// If the enum has 'EnumValueAttribute' return the 'EnumValueJsonConverter',
        /// otherwise return the 'JsonStringEnumConverter'.
        /// </summary>
        /// <param name="typeToConvert"></param>
        /// <param name="options"></param>
        /// <returns></returns>
        public override JsonConverter CreateConverter(Type typeToConvert, JsonSerializerOptions options)
        {
            var values = Enum.GetValues(typeToConvert);

            foreach (var value in values)
            {
                var mi = typeToConvert.GetMember(value.ToString());
                var evmi = mi.FirstOrDefault(m => m.DeclaringType == typeToConvert);
                var attr = evmi.GetCustomAttribute<EnumValueAttribute>();
                if (attr != null)
                {
                    return (JsonConverter)Activator.CreateInstance(typeof(EnumValueJsonConverter<>).MakeGenericType(typeToConvert));
                }
            }
            return _converter.CreateConverter(typeToConvert, options);
        }
    }
}
