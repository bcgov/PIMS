using System;
using System.Web;

namespace Pims.Core.Extensions
{
    /// <summary>
    /// UriBuilderExtensions static class, provides extension methods for UriBuilder objects.
    /// </summary>
    public static class UriBuilderExtensions
    {
        /// <summary>
        /// Append the query key=value to the query string.
        /// By default it will not add empty parameters.
        /// </summary>
        /// <param name="builder"></param>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <param name="addIfEmpty"></param>
        public static void AppendQuery(this UriBuilder builder, string key, string value, bool addIfEmpty = false)
        {
            if (String.IsNullOrWhiteSpace(key)) throw new ArgumentException("Argument cannot be null, empty or whitespace", nameof(key));

            if (addIfEmpty || !String.IsNullOrWhiteSpace(value))
            {
                var query = HttpUtility.ParseQueryString(builder.Query);
                query[key] = value;
                builder.Query = query.ToString();
            }
        }
    }
}
