using System.Linq;

namespace Pims.Core.Extensions
{
    /// <summary>
    /// ArrayExtensions static class, provides extension methods for arrays.
    /// </summary>
    public static class ArrayExtensions
    {
        /// <summary>
        /// Join all the specified arrays into a new array.
        /// Some argue that the CopyTo method is faster than the LINQ Concat.
        /// </summary>
        /// <param name="first"></param>
        /// <param name="next"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static T[] JoinAll<T>(this T[] first, params T[][] next)
        {
            var length = first.Length + next.Sum(a => a.Length);
            var newArray = new T[length];
            first.CopyTo(newArray, 0);
            var index = first.Length;
            next.ForEach(n =>
            {
                n.CopyTo(newArray, index);
                index += n.Length;
            });
            return newArray;
        }
    }
}
