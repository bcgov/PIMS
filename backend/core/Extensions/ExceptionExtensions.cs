using System;

namespace Pims.Core.Extensions
{
    /// <summary>
    /// ExceptionExtensions static class, provides extention methods for exceptions.
    /// </summary>
    public static class ExceptionExtensions
    {
        /// <summary>
        /// Get all inner error messages
        /// </summary>
        /// <param name="ex"></param>
        /// <returns></returns>
        public static string GetAllMessages(this Exception ex)
        {
            return $"{ex.Message} {ex.InnerException?.GetAllMessages()}";
        }

        /// <summary>
        /// Throw an ArgumentNullException if the value is null.
        /// </summary>
        /// <param name="value"></param>
        /// <param name="message"></param>
        /// <typeparam name="T"></typeparam>
        /// <exception type="ArgumentNullException">The argument value cannot be null.</exception>
        public static T ThrowIfNull<T>(this T value, string paramName) where T : class
        {
            return value ?? throw new ArgumentNullException(paramName);
        }
    }
}
