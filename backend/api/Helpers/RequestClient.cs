using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Pims.Api.Helpers
{
    /// <summary>
    /// RequestClient class, provides a way to make HTTP requests on behalf of the frontend application.
    /// </summary>
    public class RequestClient
    {
        #region Properties
        private readonly IHttpClientFactory _clientFactory;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a RequestClient class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="clientFactory"></param>
        public RequestClient(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Make a GET request to the specified 'url'.
        /// </summary>
        /// <param name="request"></param>
        /// <param name="url"></param>
        /// <returns></returns>
        public async Task<HttpResponseMessage> GetAsync(HttpRequest request, string url)
        {
            var token = request.Headers["Authorization"];

            var message = new HttpRequestMessage(HttpMethod.Get, url);
            message.Headers.Add("Authorization", token.ToString());
            message.Headers.Add("X-Forwarded-For", request.Host.Value);
            message.Headers.Add("User-Agent", "pims.api");

            var client = _clientFactory.CreateClient();
            var response = await client.SendAsync(message); // TODO: Solve security issue on proxying requests from app to api to keycloak.

            return response;
        }
        #endregion
    }
}
