using System.Net.Mime;
using System;

namespace Pims.Api.Helpers.Extensions
{
    /// <summary>
    /// ExceptionExtensions static class, provides extention methods for exceptions.
    /// </summary>
    public static class ExceptionExtensions
    {
        /// <summary>
        /// Get all innner messages
        /// </summary>
        /// <param name="ex"></param>
        /// <returns></returns>
        public static string GetAllMessages(this Exception ex)
        {
            return $"{ex.Message} {ex.InnerException?.GetAllMessages()}";
        }
    }
}
