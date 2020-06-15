using Microsoft.AspNetCore.Http;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace Pims.Core.Http
{
    public interface IHttpRequestClient : IDisposable
    {
        HttpClient Client { get; }
        Task<HttpResponseMessage> SendAsync(string url, HttpMethod method = null, HttpContent content = null);
        Task<HttpResponseMessage> GetAsync(string url);
        Task<HttpResponseMessage> PostAsync(string url, HttpContent content = null);
        Task<HttpResponseMessage> PutAsync(string url, HttpContent content = null);
        Task<HttpResponseMessage> DeleteAsync(string url, HttpContent content = null);

        Task<HttpResponseMessage> SendAsync(Uri url, HttpMethod method = null, HttpContent content = null);
        Task<HttpResponseMessage> GetAsync(Uri url);
        Task<HttpResponseMessage> PostAsync(Uri url, HttpContent content = null);
        Task<HttpResponseMessage> PutAsync(Uri url, HttpContent content = null);
        Task<HttpResponseMessage> DeleteAsync(Uri url, HttpContent content = null);

        Task<TModel> SendAsync<TModel>(string url, HttpMethod method = null, HttpContent content = null, Func<HttpResponseMessage, bool> onError = null);
        Task<TModel> GetAsync<TModel>(string url);
        Task<TModel> PostAsync<TModel>(string url, HttpContent content = null);
        Task<TModel> PutAsync<TModel>(string url, HttpContent content = null);
        Task<TModel> DeleteAsync<TModel>(string url, HttpContent content = null);


        Task<TModel> SendAsync<TModel>(Uri url, HttpMethod method = null, HttpContent content = null, Func<HttpResponseMessage, bool> onError = null);
        Task<TModel> GetAsync<TModel>(Uri url);
        Task<TModel> PostAsync<TModel>(Uri url, HttpContent content = null);
        Task<TModel> PutAsync<TModel>(Uri url, HttpContent content = null);
        Task<TModel> DeleteAsync<TModel>(Uri url, HttpContent content = null);
    }
}
