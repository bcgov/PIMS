using Pims.Tools.Core.Extensions;
using System;
using System.Net;
using System.Net.Http;

namespace Pims.Tools.Core.Exceptions
{
    /// <summary>
    /// HttpResponseException class, provides a way to capture errors that occur during HTTP requests.
    /// </summary>
    public class HttpResponseException : Exception
    {
        #region Properties
        /// <summary>
        /// get - The error details.
        /// </summary>
        public string Details { get; }

        /// <summary>
        /// get - The HTTP Status Code
        /// </summary>
        public HttpStatusCode StatusCode { get; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a HttpResponseException class, 
        /// </summary>
        /// <param name="response"></param>
        /// <param name="message"></param>
        public HttpResponseException(HttpResponseMessage response, string message = null) : base(message)
        {
            this.StatusCode = response.StatusCode;
            using var stream = response.Content.ReadAsStreamAsync().Result;
            this.Details = stream.ReadStream();
        }
        #endregion
    }
}
