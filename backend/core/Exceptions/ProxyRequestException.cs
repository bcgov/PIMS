using System;
using System.Net;
using System.Net.Http;

namespace Pims.Core.Exceptions
{
    /// <summary>
    /// ProxyRequestException class, provides a way to express HTTP request exceptions that occur.
    /// </summary>
    public class ProxyRequestException : HttpClientRequestException
    { 
        #region Constructors
        /// <summary>
        /// Creates a new instance of an ProxyRequestException class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="message"></param>
        /// <param name="statusCode"></param>
        /// <returns></returns>
        public ProxyRequestException(string message, HttpStatusCode statusCode = HttpStatusCode.InternalServerError) : base(message, statusCode) {}

        /// <summary>
        /// Creates a new instance of an ProxyRequestException class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="message"></param>
        /// <param name="innerException"></param>
        /// <param name="statusCode"></param>
        /// <returns></returns>
        public ProxyRequestException(string message, Exception innerException, HttpStatusCode statusCode = HttpStatusCode.InternalServerError) : base(message, innerException, statusCode) {}

        /// <summary>
        /// Creates a new instance of an ProxyRequestException class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="response"></param>
        /// <returns></returns>
        public ProxyRequestException(HttpResponseMessage response) : base(response) {}

        /// <summary>
        /// Creates a new instance of an ProxyRequestException class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="response"></param>
        /// <returns></returns>
        public ProxyRequestException(HttpResponseMessage response, Exception innerException) : base(response, innerException) {}
        #endregion
    }
}
