using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace Pims.Core.Http
{
    public interface IHttpRequestClient : IDisposable
    {
        HttpClient Client { get; }
        Task<TModel> DeserializeAsync<TModel>(HttpResponseMessage response);

        Task<HttpResponseMessage> SendJsonAsync<T>(string url, HttpMethod method = null, T data = null) where T : class;
        Task<HttpResponseMessage> SendJsonAsync<T>(string url, HttpMethod method, HttpRequestHeaders headers, T data = null) where T : class;
        Task<HttpResponseMessage> PostJsonAsync<T>(string url, T data = null) where T : class;
        Task<HttpResponseMessage> PutJsonAsync<T>(string url, T data = null) where T : class;
        Task<HttpResponseMessage> DeleteJsonAsync<T>(string url, T data = null) where T : class;

        Task<HttpResponseMessage> SendAsync(string url, HttpMethod method = null, HttpContent content = null);
        Task<HttpResponseMessage> SendAsync(string url, HttpMethod method, HttpRequestHeaders headers, HttpContent content = null);
        Task<HttpResponseMessage> GetAsync(string url);
        Task<HttpResponseMessage> PostAsync(string url, HttpContent content = null);
        Task<HttpResponseMessage> PutAsync(string url, HttpContent content = null);
        Task<HttpResponseMessage> DeleteAsync(string url, HttpContent content = null);

        Task<HttpResponseMessage> SendJsonAsync<T>(Uri url, HttpMethod method = null, T data = null) where T : class;
        Task<HttpResponseMessage> SendJsonAsync<T>(Uri url, HttpMethod method, HttpRequestHeaders headers, T data = null) where T : class;
        Task<HttpResponseMessage> PostJsonAsync<T>(Uri url, T data = null) where T : class;
        Task<HttpResponseMessage> PutJsonAsync<T>(Uri url, T data = null) where T : class;
        Task<HttpResponseMessage> DeleteJsonAsync<T>(Uri url, T data = null) where T : class;

        Task<HttpResponseMessage> SendAsync(Uri url, HttpMethod method = null, HttpContent content = null);
        Task<HttpResponseMessage> SendAsync(Uri url, HttpMethod method, HttpRequestHeaders headers, HttpContent content = null);
        Task<HttpResponseMessage> GetAsync(Uri url);
        Task<HttpResponseMessage> PostAsync(Uri url, HttpContent content = null);
        Task<HttpResponseMessage> PutAsync(Uri url, HttpContent content = null);
        Task<HttpResponseMessage> DeleteAsync(Uri url, HttpContent content = null);

        Task<TModel> SendJsonAsync<TModel, T>(string url, HttpMethod method = null, T data = null, Func<HttpResponseMessage, bool> onError = null) where T : class;
        Task<TModel> SendJsonAsync<TModel, T>(string url, HttpMethod method, HttpRequestHeaders headers, T data = null, Func<HttpResponseMessage, bool> onError = null) where T : class;
        Task<TModel> PostJsonAsync<TModel, T>(string url, T data = null) where T : class;
        Task<TModel> PutJsonAsync<TModel, T>(string url, T data = null) where T : class;
        Task<TModel> DeleteJsonAsync<TModel, T>(string url, T data = null) where T : class;

        Task<TModel> SendAsync<TModel>(string url, HttpMethod method = null, HttpContent content = null, Func<HttpResponseMessage, bool> onError = null);
        Task<TModel> SendAsync<TModel>(string url, HttpMethod method, HttpRequestHeaders headers, HttpContent content = null, Func<HttpResponseMessage, bool> onError = null);
        Task<TModel> GetAsync<TModel>(string url);
        Task<TModel> PostAsync<TModel>(string url, HttpContent content = null);
        Task<TModel> PutAsync<TModel>(string url, HttpContent content = null);
        Task<TModel> DeleteAsync<TModel>(string url, HttpContent content = null);

        Task<TModel> SendJsonAsync<TModel, T>(Uri url, HttpMethod method = null, T data = null, Func<HttpResponseMessage, bool> onError = null) where T : class;
        Task<TModel> SendJsonAsync<TModel, T>(Uri url, HttpMethod method, HttpRequestHeaders headers, T data = null, Func<HttpResponseMessage, bool> onError = null) where T : class;
        Task<TModel> PostJsonAsync<TModel, T>(Uri url, T data = null) where T : class;
        Task<TModel> PutJsonAsync<TModel, T>(Uri url, T data = null) where T : class;
        Task<TModel> DeleteJsonAsync<TModel, T>(Uri url, T data = null) where T : class;

        Task<TModel> SendAsync<TModel>(Uri url, HttpMethod method = null, HttpContent content = null, Func<HttpResponseMessage, bool> onError = null);
        Task<TModel> SendAsync<TModel>(Uri url, HttpMethod method, HttpRequestHeaders headers, HttpContent content = null, Func<HttpResponseMessage, bool> onError = null);
        Task<TModel> GetAsync<TModel>(Uri url);
        Task<TModel> PostAsync<TModel>(Uri url, HttpContent content = null);
        Task<TModel> PutAsync<TModel>(Uri url, HttpContent content = null);
        Task<TModel> DeleteAsync<TModel>(Uri url, HttpContent content = null);
    }
}
