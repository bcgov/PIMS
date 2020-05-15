using System;
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
        /// <param name="postal"></param>
        /// <returns></returns>
        public static string FormatAsPostal(this string postal)
        {
            if (postal?.Length == 6 && (!postal?.Contains(" ") ?? false))
                return postal?.ToUpper().Insert(3, " ");
            return postal?.ToUpper();
        }
    }
}
