using System;
using System.Collections.Generic;
using System.Linq;

namespace Pims.Core.Extensions
{
    /// <summary>
    /// DictionaryExtensions static class, provides extension methods for dictionary objects.
    /// </summary>
    public static class DictionaryExtensions
    {
        /// <summary>
        /// Get the value from the dictionary for the specified 'key' and return it as an int.
        /// </summary>
        /// <param name="IDictionary<string"></param>
        /// <param name="dict"></param>
        /// <param name="key"></param>
        /// <param name="defaultValue"></param>
        /// <returns></returns>
        public static int GetIntValue(this IDictionary<string, Microsoft.Extensions.Primitives.StringValues> dict, string key, int defaultValue = 0)
        {
            return dict.TryGetValue(key, out Microsoft.Extensions.Primitives.StringValues dValue) && int.TryParse(dValue, out int value) ? value : defaultValue;
        }

        /// <summary>
        /// Get the value from the dictionary for the specified 'key' and return it as an int.
        /// </summary>
        /// <param name="IDictionary<string"></param>
        /// <param name="dict"></param>
        /// <param name="key"></param>
        /// <param name="defaultValue"></param>
        /// <returns></returns>
        public static int? GetIntNullValue(this IDictionary<string, Microsoft.Extensions.Primitives.StringValues> dict, string key, int? defaultValue = null)
        {
            return dict.TryGetValue(key, out Microsoft.Extensions.Primitives.StringValues dValue) && int.TryParse(dValue, out int value) ? value : defaultValue;
        }

        /// <summary>
        /// Get the value from the dictionary for the specified 'key' and return it as an array of int.
        /// </summary>
        /// <param name="IDictionary<string"></param>
        /// <param name="dict"></param>
        /// <param name="key"></param>
        /// <param name="separator"></param>
        /// <returns></returns>
        public static int[] GetIntArrayValue(this IDictionary<string, Microsoft.Extensions.Primitives.StringValues> dict, string key, string separator = ",")
        {
            return dict.TryGetValue(key, out Microsoft.Extensions.Primitives.StringValues value) ? value.ToString().Split(separator).Select(v => { int.TryParse(v, out int iv); return iv; }).ToArray() : new int[0];
        }

        /// <summary>
        /// Get the value from the dictionary for the specified 'key' and return it as an float.
        /// </summary>
        /// <param name="IDictionary<string"></param>
        /// <param name="dict"></param>
        /// <param name="key"></param>
        /// <param name="defaultValue"></param>
        /// <returns></returns>
        public static float GetFloatValue(this IDictionary<string, Microsoft.Extensions.Primitives.StringValues> dict, string key, float defaultValue = 0)
        {
            return dict.TryGetValue(key, out Microsoft.Extensions.Primitives.StringValues dValue) && float.TryParse(dValue, out float value) ? value : defaultValue;
        }

        /// <summary>
        /// Get the value from the dictionary for the specified 'key' and return it as an float.
        /// </summary>
        /// <param name="IDictionary<string"></param>
        /// <param name="dict"></param>
        /// <param name="key"></param>
        /// <param name="defaultValue"></param>
        /// <returns></returns>
        public static float? GetFloatNullValue(this IDictionary<string, Microsoft.Extensions.Primitives.StringValues> dict, string key, float? defaultvalue = null)
        {
            return dict.TryGetValue(key, out Microsoft.Extensions.Primitives.StringValues dValue) && float.TryParse(dValue, out float value) ? value : defaultvalue;
        }

        /// <summary>
        /// Get the value from the dictionary for the specified 'key' and return it as an float.
        /// </summary>
        /// <param name="IDictionary<string"></param>
        /// <param name="dict"></param>
        /// <param name="key"></param>
        /// <param name="defaultValue"></param>
        /// <returns></returns>
        public static decimal GetDecimalValue(this IDictionary<string, Microsoft.Extensions.Primitives.StringValues> dict, string key, decimal defaultValue = 0)
        {
            return dict.TryGetValue(key, out Microsoft.Extensions.Primitives.StringValues dValue) && decimal.TryParse(dValue, out decimal value) ? value : defaultValue;
        }

        /// <summary>
        /// Get the value from the dictionary for the specified 'key' and return it as an float.
        /// </summary>
        /// <param name="IDictionary<string"></param>
        /// <param name="dict"></param>
        /// <param name="key"></param>
        /// <param name="defaultValue"></param>
        /// <returns></returns>
        public static decimal? GetDecimalNullValue(this IDictionary<string, Microsoft.Extensions.Primitives.StringValues> dict, string key, decimal? defaultvalue = null)
        {
            return dict.TryGetValue(key, out Microsoft.Extensions.Primitives.StringValues dValue) && decimal.TryParse(dValue, out decimal value) ? value : defaultvalue;
        }

        /// <summary>
        /// Get the value from the dictionary for the specified 'key' and return it as an double.
        /// </summary>
        /// <param name="IDictionary<string"></param>
        /// <param name="dict"></param>
        /// <param name="key"></param>
        /// <param name="defaultValue"></param>
        /// <returns></returns>
        public static double GetDoubleValue(this IDictionary<string, Microsoft.Extensions.Primitives.StringValues> dict, string key, double defaultValue = 0)
        {
            return dict.TryGetValue(key, out Microsoft.Extensions.Primitives.StringValues dValue) && double.TryParse(dValue, out double value) ? value : defaultValue;
        }

        /// <summary>
        /// Get the value from the dictionary for the specified 'key' and return it as an double.
        /// </summary>
        /// <param name="IDictionary<string"></param>
        /// <param name="dict"></param>
        /// <param name="key"></param>
        /// <param name="defaultValue"></param>
        /// <returns></returns>
        public static double? GetDoubleNullValue(this IDictionary<string, Microsoft.Extensions.Primitives.StringValues> dict, string key, double? defaultValue = null)
        {
            return dict.TryGetValue(key, out Microsoft.Extensions.Primitives.StringValues dValue) && double.TryParse(dValue, out double value) ? value : defaultValue;
        }

        /// <summary>
        /// Get the value from the dictionary for the specified 'key' and return it as an string.
        /// </summary>
        /// <param name="IDictionary<string"></param>
        /// <param name="dict"></param>
        /// <param name="key"></param>
        /// <param name="defaultValue"></param>
        /// <returns></returns>
        public static string GetStringValue(this IDictionary<string, Microsoft.Extensions.Primitives.StringValues> dict, string key, string defaultValue = null)
        {
            return dict.TryGetValue(key, out Microsoft.Extensions.Primitives.StringValues value) ? value.ToString() : defaultValue;
        }

        /// <summary>
        /// Get the value from the dictionary for the specified 'key' and return it as an array of string.
        /// </summary>
        /// <param name="IDictionary<string"></param>
        /// <param name="dict"></param>
        /// <param name="key"></param>
        /// <param name="defaultValue"></param>
        /// <returns></returns>
        public static string[] GetStringArrayValue(this IDictionary<string, Microsoft.Extensions.Primitives.StringValues> dict, string key, string separator = ",")
        {
            return dict.TryGetValue(key, out Microsoft.Extensions.Primitives.StringValues value) ? value.ToString().Split(separator) : new string[0];
        }

        /// <summary>
        /// Get the value from the dictionary for the specified 'key' and return it as the specified type 'T'.
        /// </summary>
        /// <param name="IDictionary<string"></param>
        /// <param name="dict"></param>
        /// <param name="key"></param>
        /// <param name="defaultValue"></param>
        /// <returns></returns>
        public static T GetValue<T>(this IDictionary<string, Microsoft.Extensions.Primitives.StringValues> dict, string key, T defaultValue = default)
        {
            return dict.TryGetValue(key, out Microsoft.Extensions.Primitives.StringValues value) ? (T)Convert.ChangeType(value, typeof(T)) : defaultValue;
        }
    }
}
