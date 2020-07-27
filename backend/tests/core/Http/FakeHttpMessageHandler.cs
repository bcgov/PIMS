using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace Pims.Core.Test.Http
{
    /// <summary>
    /// FakeHttpMessageHandler class, provides a way to create a fake HTTP message handler to mock an HTTP request.
    /// </summary>
    public class FakeHttpMessageHandler : DelegatingHandler
    {
        #region Variables
        private readonly HttpResponseMessage _fakeResponse;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a FakeHttpMessageHandler, initializes with the response that will be returned by SendAsync(...).
        /// </summary>
        /// <param name="response"></param>
        public FakeHttpMessageHandler(HttpResponseMessage response)
        {
            _fakeResponse = response;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Always returns the initialized response.
        /// </summary>
        /// <param name="request"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            return await Task.FromResult(_fakeResponse);
        }
        #endregion
    }
}
