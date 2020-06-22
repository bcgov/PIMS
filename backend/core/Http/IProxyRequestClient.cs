using Microsoft.AspNetCore.Http;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace Pims.Core.Http
{
    public interface IProxyRequestClient : IDisposable
    {
        Task<HttpResponseMessage> ProxySendAsync(HttpRequest request, string url, HttpMethod method = null, HttpContent content = null);
        Task<HttpResponseMessage> ProxyGetAsync(HttpRequest request, string url);
        Task<HttpResponseMessage> ProxyPostAsync(HttpRequest request, string url, HttpContent content = null);
        Task<HttpResponseMessage> ProxyPutAsync(HttpRequest request, string url, HttpContent content = null);
        Task<HttpResponseMessage> ProxyDeleteAsync(HttpRequest request, string url, HttpContent content = null);
    }
}
