using System;

namespace Pims.Api.Helpers.Exceptions
{
    /// <summary>
    /// BadRequestException class, provides a way to handle bad request exceptions so that they are returned by the middleware in a standardized way.
    /// </summary>
    public class BadRequestException : Exception
    {
        #region Constructors
        /// <summary>
        /// Creates a new instance of a BadRequestException object, initializes it with the specified arguments.
        /// </summary>
        /// <param name="message"></param>
        /// <returns></returns>
        public BadRequestException(string message) : base(message) { }

        /// <summary>
        /// Creates a new instance of a BadRequestException object, initializes it with the specified arguments.
        /// /// </summary>
        /// <param name="message"></param>
        /// <param name="innerException"></param>
        /// <returns></returns>
        public BadRequestException(string message, Exception innerException) : base(message, innerException) { }
        #endregion
    }
}
