using System;
using System.Net.Http;
using System.Text;

namespace Pims.Core.Extensions
{
    /// <summary>
    /// StringExtensions static class, provides extension methods for strings.
    /// </summary>
    public static class StringExtensions
    {
        /// <summary>
        /// Extracts the first letter of each word from the text and returns the value.
        /// </summary>
        /// <param name="text"></param>
        /// <param name="uppercase"></param>
        /// <returns></returns>
        public static string GetFirstLetterOfEachWord(this string text, bool uppercase = true)
        {
            var result = new StringBuilder();
            var split = text.Split(" ", StringSplitOptions.RemoveEmptyEntries);
            foreach (var part in split)
            {
                var letter = part.Substring(0, 1);
                result.Append(uppercase ? letter.ToUpper() : letter);
            }
            return result.ToString();
        }

        /// <summary>
        /// Checks if the current hosting environment name is Production.
        /// </summary>
        /// <param name="env">The environment name.</param>
        /// <returns>True if the environment name is Production, otherwise false.</returns>
        public static bool IsProduction(this string env)
        {
            return env != null && env.Equals("Production", StringComparison.OrdinalIgnoreCase);
        }

        /// <summary>
        /// Formats the specified postal value.
        /// </summary>
        /// <param name="postal">The specified postal value</param>
        /// <returns>Postal with format XXX XXX.</returns>
        public static string FormatAsPostal(this string postal)
        {
            if (postal?.Length == 6 && (!postal?.Contains(" ") ?? false))
                return postal?.ToUpper().Insert(3, " ");
            return postal?.ToUpper();
        }

        /// <summary>
        /// Lowercases the first character of the specified 'word'.
        /// </summary>
        /// <param name="word"></param>
        /// <returns></returns>
        public static string LowercaseFirstCharacter(this string word)
        {
            if (!String.IsNullOrWhiteSpace(word) && !char.IsUpper(word[0]))
            {
                return char.ToLower(word[0]) + (word.Length > 1 ? word.Substring(1) : null);
            }
            return word;
        }

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

        /// <summary>
        /// Convert the specified 'value' from default to UTF8 encoding.
        /// Replace linebreaks with spaces.
        /// </summary>
        /// <param name="value"></param>
        /// <param name="replaceLineBreaks"></param>
        /// <returns></returns>
        public static string ConvertToUTF8(this string value, bool replaceLineBreaks = true)
        {
            if (value == null) return value;
            var bytes = Encoding.Default.GetBytes(replaceLineBreaks ? value.Replace("\r\n", " ") : value);
            return Encoding.UTF8.GetString(bytes);
        }
    }
}
