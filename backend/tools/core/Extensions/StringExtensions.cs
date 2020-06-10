using System.Net.Http;

namespace Pims.Tools.Core.Extensions
{
    /// <summary>
    /// StringExtensions static class, provides extension methods for strings.
    /// </summary>
    public static class StringExtensions
    {
        /// <summary>
        /// Determine what HTTP method to use.
        /// </summary>
        /// <param name="method"></param>
        /// <return></return>
        public static HttpMethod GetHttpMethod(this string method)
        {
            return (method?.ToLower()) switch
            {
                ("get") => HttpMethod.Get,
                ("delete") => HttpMethod.Delete,
                ("put") => HttpMethod.Put,
                _ => HttpMethod.Post,
            };
        }
    }
}
