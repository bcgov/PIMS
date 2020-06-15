using System.IO;
using System.Text.Json;
using System.Threading.Tasks;

namespace Pims.Core.Extensions
{
    /// <summary>
    /// JsonSerializerExtensions static class, provides extension methods for JSON serialization and deserialization.
    /// </summary>
    public static class JsonSerializerExtensions
    {
        #region Variables
        /// <summary>
        /// JSON formatting options.
        /// </summary>
        /// <value></value>
        private static readonly JsonSerializerOptions _jsonFormatOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            IgnoreNullValues = true,
            WriteIndented = true
        };
        #endregion

        #region Methods
        /// <summary>
        /// Deserialize the specified string into the specified object of type 'T'.
        /// </summary>
        /// <param name="utf8Json"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static async Task<T> DeserializeAsync<T>(this Stream utf8Json)
        {
            return await JsonSerializer.DeserializeAsync<T>(utf8Json, _jsonFormatOptions);
        }

        /// <summary>
        /// Deserialize the specified string into the specified object of type 'T'.
        /// </summary>
        /// <param name="json"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static T Deserialize<T>(this string json)
        {
            return JsonSerializer.Deserialize<T>(json, _jsonFormatOptions);
        }

        /// <summary>
        /// Serialize the object into a JSON string.
        /// </summary>
        /// <param name="item"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static string Serialize<T>(this T item)
        {
            return JsonSerializer.Serialize(item, _jsonFormatOptions);
        }

        /// <summary>
        /// Serialize the object into a JSON string within the stream.
        /// </summary>
        /// <param name="utf8Json"></param>
        /// <param name="item"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static async Task SerializeAsync<T>(this Stream utf8Json, T item)
        {
            await JsonSerializer.SerializeAsync(utf8Json, item, _jsonFormatOptions);
        }
        #endregion
    }
}
