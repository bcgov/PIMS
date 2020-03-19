using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Pims.Keycloak
{
    public interface IKeycloakRequestClient : IDisposable
    {
        #region Properties
        Configuration.KeycloakOptions Options { get; }
        #endregion

        #region Methods
        Task<HttpResponseMessage> ProxySendAsync(HttpRequest request, string url, HttpMethod method = null, HttpContent content = null);
        Task<HttpResponseMessage> ProxyGetAsync(HttpRequest request, string url);
        Task<HttpResponseMessage> ProxyPostAsync(HttpRequest request, string url, HttpContent content = null);
        Task<HttpResponseMessage> ProxyPutAsync(HttpRequest request, string url, HttpContent content = null);
        Task<HttpResponseMessage> ProxyDeleteAsync(HttpRequest request, string url, HttpContent content = null);
        Task<HttpResponseMessage> RequestToken();
        Task<string> RequestAccessToken();
        Task<HttpResponseMessage> SendAsync(string url, HttpMethod method, HttpContent content = null);
        Task<HttpResponseMessage> GetAsync(string url);
        Task<HttpResponseMessage> PostAsync(string url, HttpContent content = null);
        Task<HttpResponseMessage> PutAsync(string url, HttpContent content = null);
        Task<HttpResponseMessage> DeleteAsync(string url, HttpContent content = null);
        #endregion
    }
}
