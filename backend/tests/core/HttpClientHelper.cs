using Moq;
using Pims.Core.Test.Http;
using System.Net.Http;

namespace Pims.Core.Test
{
    /// <summary>
    /// HttpClientHelper static class, provides extension methods for the TestHelper for HttpClient objects.
    /// </summary>
    public static class HttpClientHelper
    {
        /// <summary>
        /// Mock a new HttpClientFactory and configure the response.
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="response"></param>
        /// <returns></returns>
        public static IHttpClientFactory CreateHttpClientFactory(this TestHelper helper, HttpResponseMessage response)
        {
            var mock = new Mock<IHttpClientFactory>();
            var fake = new FakeHttpMessageHandler(response);
            var client = new HttpClient(fake);
            mock.Setup(m => m.CreateClient(It.IsAny<string>())).Returns(client);

            helper.AddSingleton(mock);
            helper.AddSingleton(mock.Object);

            return mock.Object;
        }
    }
}
