using Pims.Core.Http.Configuration;
using System.Net.Http;
using System.Threading.Tasks;

namespace Pims.Core.Http
{
    public interface IOpenIdConnectRequestClient
    {
        AuthClientOptions AuthClientOptions { get; }
        OpenIdConnectOptions OpenIdConnectOptions { get; }
        Task<Models.OpenIdConnectModel> GetOpenIdConnectEndpoints();
        Task<string> RequestAccessToken();
        Task<HttpResponseMessage> RequestToken();
        Task<HttpResponseMessage> SendAsync(string url, HttpMethod method, HttpContent content = null);
        Task<HttpResponseMessage> GetAsync(string url);
        Task<HttpResponseMessage> PostAsync(string url, HttpContent content = null);
        Task<HttpResponseMessage> PutAsync(string url, HttpContent content = null);
        Task<HttpResponseMessage> DeleteAsync(string url, HttpContent content = null);
    }
}
