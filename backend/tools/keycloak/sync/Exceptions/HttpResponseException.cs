using Pims.Tools.Keycloak.Sync.Extensions;
using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Pims.Tools.Keycloak.Sync.Exceptions
{
    public class HttpResponseException : Exception
    {
        #region Properties
        public string Details { get; }
        public HttpStatusCode StatusCode { get; }
        #endregion

        #region Constructors
        public HttpResponseException(HttpResponseMessage response, string message = null) : base(message)
        {
            this.StatusCode = response.StatusCode;
            using var stream = response.Content.ReadAsStreamAsync().Result;
            if (response.Content.Headers.ContentType == new MediaTypeHeaderValue("application/json"))
            {
                var results = JsonSerializer.DeserializeAsync<object>(stream).Result;
                this.Details = JsonSerializer.Serialize(results); // TODO: Not ideal to return JSON as the error.
            }
            else
            {
                this.Details = stream.ReadStream();
            }

        }
        #endregion
    }
}
