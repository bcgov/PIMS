using Microsoft.Extensions.Options;
using Pims.Core.Exceptions;
using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace Pims.Core.Http
{
    public class HttpRequestClient : IHttpRequestClient
    {
        #region Variables
        private readonly JsonSerializerOptions _serializeOptions;
        #endregion

        #region Properties
        /// <summary>
        /// get - The HttpClient use to make requests.
        /// </summary>
        public HttpClient Client { get; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a HttpRequestClient class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="clientFactory"></param>
        /// <param name="options"></param>
        public HttpRequestClient(IHttpClientFactory clientFactory, IOptions<JsonSerializerOptions> options)
        {
            this.Client = clientFactory.CreateClient();
            _serializeOptions = options?.Value ?? new JsonSerializerOptions()
            {
                PropertyNameCaseInsensitive = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                IgnoreNullValues = true
            };
        }
        #endregion

        #region Methods
        /// <summary>
        /// Dispose the HttpClient.
        /// </summary>
        public void Dispose()
        {
            this.Client.Dispose();
        }

        #region HttpResponseMessage Methods
        /// <summary>
        /// Send an HTTP request to the specified 'url'.
        /// </summary>
        /// <param name="url"></param>
        /// <param name="method"></param>
        /// <param name="content"></param>
        /// <returns></returns>
        public virtual async Task<HttpResponseMessage> SendAsync(string url, HttpMethod method = null, HttpContent content = null)
        {
            if (String.IsNullOrWhiteSpace(url)) throw new ArgumentException($"Argument '{nameof(url)}' must be a valid URL.");

            if (method == null) method = HttpMethod.Get;

            var message = new HttpRequestMessage(method, url);
            message.Headers.Add("User-Agent", "Pims.Api");
            message.Content = content;

            return await this.Client.SendAsync(message);
        }

        /// <summary>
        /// GET request to the specified 'url'.
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        public async Task<HttpResponseMessage> GetAsync(string url)
        {
            return await SendAsync(url, HttpMethod.Get);
        }

        /// <summary>
        /// POST request to the specified 'url'.
        /// </summary>
        /// <param name="url"></param>
        /// <param name="content"></param>
        /// <returns></returns>
        public async Task<HttpResponseMessage> PostAsync(string url, HttpContent content = null)
        {
            return await SendAsync(url, HttpMethod.Post, content);
        }

        /// <summary>
        /// PUT request to the specified 'url'.
        /// </summary>
        /// <param name="url"></param>
        /// <param name="content"></param>
        /// <returns></returns>
        public async Task<HttpResponseMessage> PutAsync(string url, HttpContent content = null)
        {
            return await SendAsync(url, HttpMethod.Put, content);
        }

        /// <summary>
        /// DELETE request to the specified 'url'.
        /// </summary>
        /// <param name="url"></param>
        /// <param name="content"></param>
        /// <returns></returns>
        public async Task<HttpResponseMessage> DeleteAsync(string url, HttpContent content = null)
        {
            return await SendAsync(url, HttpMethod.Delete, content);
        }


        /// <summary>
        /// Send an HTTP request to the specified 'uri'.
        /// </summary>
        /// <param name="uri"></param>
        /// <param name="method"></param>
        /// <param name="content"></param>
        /// <returns></returns>
        public virtual async Task<HttpResponseMessage> SendAsync(Uri uri, HttpMethod method = null, HttpContent content = null)
        {
            if (uri == null) throw new ArgumentNullException(nameof(uri));
            if (method == null) method = HttpMethod.Get;

            var message = new HttpRequestMessage(method, uri);
            message.Headers.Add("User-Agent", "Pims.Api");
            message.Content = content;

            return await this.Client.SendAsync(message);
        }

        /// <summary>
        /// GET request to the specified 'uri'.
        /// </summary>
        /// <param name="uri"></param>
        /// <returns></returns>
        public async Task<HttpResponseMessage> GetAsync(Uri uri)
        {
            return await SendAsync(uri, HttpMethod.Get);
        }

        /// <summary>
        /// POST request to the specified 'uri'.
        /// </summary>
        /// <param name="uri"></param>
        /// <param name="content"></param>
        /// <returns></returns>
        public async Task<HttpResponseMessage> PostAsync(Uri uri, HttpContent content = null)
        {
            return await SendAsync(uri, HttpMethod.Post, content);
        }

        /// <summary>
        /// PUT request to the specified 'uri'.
        /// </summary>
        /// <param name="uri"></param>
        /// <param name="content"></param>
        /// <returns></returns>
        public async Task<HttpResponseMessage> PutAsync(Uri uri, HttpContent content = null)
        {
            return await SendAsync(uri, HttpMethod.Put, content);
        }

        /// <summary>
        /// DELETE request to the specified 'uri'.
        /// </summary>
        /// <param name="uri"></param>
        /// <param name="content"></param>
        /// <returns></returns>
        public async Task<HttpResponseMessage> DeleteAsync(Uri uri, HttpContent content = null)
        {
            return await SendAsync(uri, HttpMethod.Delete, content);
        }
        #endregion

        #region Serialization Methods
        /// <summary>
        /// Send an HTTP request to the specified 'url'.
        /// </summary>
        /// <param name="url"></param>
        /// <param name="method"></param>
        /// <param name="content"></param>
        /// <param name="onError"></param>
        /// <returns></returns>
        public virtual async Task<TModel> SendAsync<TModel>(string url, HttpMethod method = null, HttpContent content = null, Func<HttpResponseMessage, bool> onError = null)
        {
            var response = await SendAsync(url, method, content);

            if (response.IsSuccessStatusCode)
            {
                using var stream = await response.Content.ReadAsStreamAsync();
                return await JsonSerializer.DeserializeAsync<TModel>(stream, _serializeOptions);
            }

            // If the error handle is not provided, or if it returns false throw an error.
            if ((onError?.Invoke(response) ?? false) == false)
                throw new HttpClientRequestException(response);

            return default;
        }

        /// <summary>
        /// GET request to the specified 'url'.
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        public async Task<TModel> GetAsync<TModel>(string url)
        {
            return await SendAsync<TModel>(url, HttpMethod.Get);
        }

        /// <summary>
        /// POST request to the specified 'url'.
        /// </summary>
        /// <param name="url"></param>
        /// <param name="content"></param>
        /// <returns></returns>
        public async Task<TModel> PostAsync<TModel>(string url, HttpContent content = null)
        {
            return await SendAsync<TModel>(url, HttpMethod.Post, content);
        }

        /// <summary>
        /// PUT request to the specified 'url'.
        /// </summary>
        /// <param name="url"></param>
        /// <param name="content"></param>
        /// <returns></returns>
        public async Task<TModel> PutAsync<TModel>(string url, HttpContent content = null)
        {
            return await SendAsync<TModel>(url, HttpMethod.Put, content);
        }

        /// <summary>
        /// DELETE request to the specified 'url'.
        /// </summary>
        /// <param name="url"></param>
        /// <param name="content"></param>
        /// <returns></returns>
        public async Task<TModel> DeleteAsync<TModel>(string url, HttpContent content = null)
        {
            return await SendAsync<TModel>(url, HttpMethod.Delete, content);
        }

        /// <summary>
        /// Send an HTTP request to the specified 'uri'.
        /// </summary>
        /// <param name="uri"></param>
        /// <param name="method"></param>
        /// <param name="content"></param>
        /// <param name="onError"></param>
        /// <returns></returns>
        public virtual async Task<TModel> SendAsync<TModel>(Uri uri, HttpMethod method = null, HttpContent content = null, Func<HttpResponseMessage, bool> onError = null)
        {
            var response = await SendAsync(uri, method, content);

            if (response.IsSuccessStatusCode)
            {
                using var stream = await response.Content.ReadAsStreamAsync();
                return await JsonSerializer.DeserializeAsync<TModel>(stream, _serializeOptions);
            }

            // If the error handle is not provided, or if it returns false throw an error.
            if ((onError?.Invoke(response) ?? false) == false)
                throw new HttpClientRequestException(response);

            return default;
        }

        /// <summary>
        /// GET request to the specified 'uri'.
        /// </summary>
        /// <param name="uri"></param>
        /// <returns></returns>
        public async Task<TModel> GetAsync<TModel>(Uri uri)
        {
            return await SendAsync<TModel>(uri, HttpMethod.Get);
        }

        /// <summary>
        /// POST request to the specified 'uri'.
        /// </summary>
        /// <param name="uri"></param>
        /// <param name="content"></param>
        /// <returns></returns>
        public async Task<TModel> PostAsync<TModel>(Uri uri, HttpContent content = null)
        {
            return await SendAsync<TModel>(uri, HttpMethod.Post, content);
        }

        /// <summary>
        /// PUT request to the specified 'uri'.
        /// </summary>
        /// <param name="uri"></param>
        /// <param name="content"></param>
        /// <returns></returns>
        public async Task<TModel> PutAsync<TModel>(Uri uri, HttpContent content = null)
        {
            return await SendAsync<TModel>(uri, HttpMethod.Put, content);
        }

        /// <summary>
        /// DELETE request to the specified 'uri'.
        /// </summary>
        /// <param name="uri"></param>
        /// <param name="content"></param>
        /// <returns></returns>
        public async Task<TModel> DeleteAsync<TModel>(Uri uri, HttpContent content = null)
        {
            return await SendAsync<TModel>(uri, HttpMethod.Delete, content);
        }
        #endregion
        #endregion
    }
}
