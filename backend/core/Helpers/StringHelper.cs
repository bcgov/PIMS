using System;
using System.Linq;

namespace Pims.Core.Helpers
{
    /// <summary>
    /// StringHelpers static class, provides helper methods for strings.
    /// </summary>
    public static class StringHelper
    {
        #region Variables
        private static readonly Random rand = new Random(DateTime.Now.Second);
        #endregion

        #region Methods
        /// <summary>
        /// Generate a random set of characters to the specified 'length'.
        /// The longer the length, the more random the value.
        /// </summary>
        /// <param name="length"></param>
        /// <returns></returns>
        public static string Generate(int length)
        {
            if (length < 2) throw new ArgumentException("Length must be greater than or equal to 2.", nameof(length));

            var constonants = new[] { "b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "l", "n", "p", "q", "r", "s", "t", "v", "w", "x" };
            var vowels = new[] { "a", "e", "i", "o", "u", "y" };
            var numbers = new[] { "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" };
            var symbols = new[] { "_", "+", "-", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "?" };
            var all = constonants.Concat(vowels).Concat(numbers).Concat(symbols).ToArray();

            string value = "";
            value += constonants[rand.Next(constonants.Length)].ToUpper();
            value += vowels[rand.Next(vowels.Length)];
            int b = 2; //b tells how many times a new letter has been added. It's 2 right now because the first two letters are already in the name.
            while (b < length)
            {
                value += all[rand.Next(all.Length)];
                b++;
            }

            return value;
        }
        #endregion
    }
}
