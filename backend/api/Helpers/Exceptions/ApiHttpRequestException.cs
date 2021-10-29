using System;
using System.Net;
using System.Net.Http;

namespace Pims.Api.Helpers.Exceptions
{
    /// <summary>
    /// ApiHttpRequestException class, provides a way to express HTTP request exceptions that occur.
    /// </summary>
    public class ApiHttpRequestException : HttpRequestException
    {
        #region Properties
        /// <summary>
        /// get - The HTTP response message.
        /// </summary>
        public HttpResponseMessage Response { get; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of an ApiHttpRequestException class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="message"></param>
        /// <param name="statusCode"></param>
        /// <returns></returns>
        public ApiHttpRequestException(string message, HttpStatusCode statusCode = HttpStatusCode.InternalServerError) : base(message, null, statusCode)
        {
        }

        /// <summary>
        /// Creates a new instance of an ApiHttpRequestException class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="message"></param>
        /// <param name="innerException"></param>
        /// <param name="statusCode"></param>
        /// <returns></returns>
        public ApiHttpRequestException(string message, Exception innerException, HttpStatusCode statusCode = HttpStatusCode.InternalServerError) : base(message, innerException, statusCode)
        {
        }

        /// <summary>
        /// Creates a new instance of an ApiHttpRequestException class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="response"></param>
        /// <returns></returns>
        public ApiHttpRequestException(HttpResponseMessage response) : base($"HTTP Request '{response.RequestMessage.RequestUri}' failed", null, response.StatusCode)
        {
            this.Response = response ?? throw new ArgumentNullException(nameof(response)); // NOSONAR
        }
        #endregion
    }
}
