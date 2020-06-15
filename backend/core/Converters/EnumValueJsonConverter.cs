using Pims.Core.Json;
using System;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Pims.Core.Converters
{
    /// <summary>
    /// EnumValueJsonConverter class, provides a way to convert enum values.
    /// Serialization - Extract value from 'EnumValueAttribute' otherwise lowercase the enum name value.
    /// Deserialization - Ignore case.
    /// </summary>
    /// <typeparam name="ET"></typeparam>
    public class EnumValueJsonConverter<ET> : JsonConverter<ET>
        where ET : struct, IConvertible
    {
        #region Methods
        /// <summary>
        /// Ignore case when parsing, otherwise return default.
        /// </summary>
        /// <param name="reader"></param>
        /// <param name="typeToConvert"></param>
        /// <param name="options"></param>
        /// <returns></returns>
        public override ET Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            var value = reader.GetString();

            var valid = Enum.TryParse(value, true, out ET result);

            if (valid)
            {
                return result;
            }
            else
            {
                var fields = Enum.GetValues(typeof(ET));
                foreach (var field in fields)
                {
                    var mi = typeof(ET).GetMember(field.ToString());
                    var attr = mi[0].GetCustomAttribute<EnumValueAttribute>();
                    if (attr != null && String.CompareOrdinal(value, attr.Value) == 0)
                    {
                        return (ET)field;
                    }
                }
            }

            return default;
        }

        /// <summary>
        /// Extract name from 'EnumJsonAttribute' if exists, or return enum property naem in lowercase.
        /// </summary>
        /// <param name="writer"></param>
        /// <param name="value"></param>
        /// <param name="options"></param>
        public override void Write(Utf8JsonWriter writer, ET value, JsonSerializerOptions options)
        {
            var fi = typeof(ET).GetField(value.ToString());
            var attr = fi.GetCustomAttribute<EnumValueAttribute>();

            if (attr != null)
            {
                writer.WriteStringValue(attr.Value);
            }
            else
            {
                writer.WriteStringValue($"{value}".ToLower());
            }
        }
        #endregion
    }
}
