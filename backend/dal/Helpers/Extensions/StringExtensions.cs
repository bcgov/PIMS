using System.Text;

namespace Pims.Dal.Helpers.Extensions
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
            var split = text.Split();
            foreach (var part in split)
            {
                var letter = part.Substring(0, 1);
                result.Append(uppercase ? letter.ToUpper() : letter);
            }
            return result.ToString();
        }
    }
}
