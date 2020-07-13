using Pims.Core.Http;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace Pims.Tools.Core
{
    /// <summary>
    /// IRequestClient interface, provides an HTTP client to make requests and handle refresh token.
    /// </summary>
    public interface IRequestClient : IOpenIdConnectRequestClient
    {
        /// <summary>
        /// Recursively retry after a failure based on configuration.
        /// </summary>
        /// <param name="method"></param>
        /// <param name="url"></param>
        /// <param name="attempt"></param>
        Task<RT> RetryAsync<RT>(HttpMethod method, string url, int attempt = 1)
            where RT : class;

        /// <summary>
        /// Recursively retry after a failure based on configuration.
        /// </summary>
        /// <param name="method"></param>
        /// <param name="url"></param>
        /// <param name="data"></param>
        /// <param name="attempt"></param>
        /// <returns></returns>
        Task<RT> RetryAsync<RT, T>(HttpMethod method, string url, T data = default, int attempt = 1)
            where RT : class
            where T : class;

        /// <summary>
        /// Send an HTTP GET request.
        /// Deserialize the result into the specified 'RT' type.
        /// </summary>
        /// <param name="url"></param>
        /// <param name="onError"></param>
        /// <returns></returns>
        Task<RT> HandleGetAsync<RT>(string url, Func<HttpResponseMessage, bool> onError = null)
            where RT : class;

        /// <summary>
        /// Send an HTTP request.
        /// Deserialize the result into the specified 'RT' type.
        /// </summary>
        /// <param name="method"></param>
        /// <param name="url"></param>
        /// <param name="onError"></param>
        /// <returns></returns>
        Task<RT> HandleRequestAsync<RT>(HttpMethod method, string url, Func<HttpResponseMessage, bool> onError = null)
            where RT : class;

        /// <summary>
        /// Send the items in an HTTP request.
        /// Deserialize the result into the specified 'RT' type.
        /// </summary>
        /// <param name="method"></param>
        /// <param name="url"></param>
        /// <param name="data"></param>
        /// <param name="onError"></param>
        /// <returns></returns>
        Task<RT> HandleRequestAsync<RT, T>(HttpMethod method, string url, T data, Func<HttpResponseMessage, bool> onError = null)
            where RT : class
            where T : class;
    }
}
