using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Pims.Api.Helpers.Exceptions;
using Pims.Dal.Exceptions;

namespace Pims.Api.Helpers
{
    /// <summary>
    /// KeycloakRequestClient class, provides a way to make HTTP requests on behalf of the frontend application to keycloak.
    /// </summary>
    public class KeycloakRequestClient : IKeycloakRequestClient, IDisposable
    {
        #region Properties
        private readonly HttpClient _client;
        private readonly IConfiguration _config;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a KeycloakRequestClient class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="clientFactory"></param>
        /// <param name="config"></param>
        public KeycloakRequestClient(IHttpClientFactory clientFactory, IConfiguration config)
        {
            _client = clientFactory.CreateClient();
            _config = config;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Make a request to fetch the Keycloak OpenIdConnect endpoints.
        /// </summary>
        /// <returns></returns>
        public async Task<Models.Keycloak.OpenIdConnectModel> GetOpenIdConnectEndpoints()
        {
            var keycloakAuthority = _config.GetValue<string>("Keycloak:Authority") ??
                throw new ConfigurationException($"Configuration 'Keycloak:Authority' is missing or invalid.");

            var response = await _client.GetAsync($"{keycloakAuthority}/.well-known/openid-configuration");

            if (response.IsSuccessStatusCode)
            {
                using var responseStream = await response.Content.ReadAsStreamAsync();
                return await JsonSerializer.DeserializeAsync<Models.Keycloak.OpenIdConnectModel>(responseStream);
            }
            else
            {
                throw new ApiHttpRequestException(response);
            }
        }

        #region Proxy Methods
        /// <summary>
        /// Proxy the request on behalf of the original requestor to the specified 'url'.
        /// </summary>
        /// <param name="request"></param>
        /// <param name="url"></param>
        /// <param name="method"></param>
        /// <param name="content"></param>
        /// <returns></returns>
        public async Task<HttpResponseMessage> ProxySendAsync(HttpRequest request, string url, HttpMethod method = null, HttpContent content = null)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));
            if (String.IsNullOrWhiteSpace(url)) throw new ArgumentException($"Argument '{nameof(url)}' must be a valid URL.");

            // Extract the original requests authorization token.
            var token = request.Headers["Authorization"];
            if (method == null) method = HttpMethod.Get;

            var message = new HttpRequestMessage(method, url);
            if (!String.IsNullOrWhiteSpace(token)) message.Headers.Add("Authorization", token.ToString());
            message.Headers.Add("X-Forwarded-For", request.Host.Value);
            message.Headers.Add("X-Forwarded-Proto", request.Scheme);
            message.Headers.Add("ProxyPreserveHost", "On");
            message.Headers.Add("User-Agent", "Pims.Api");
            message.Content = content;

            return await _client.SendAsync(message);
        }

        /// <summary>
        /// Proxy a GET request to the specified 'url'.
        /// This will use the original requests Authorization token in the server request.
        /// </summary>
        /// <param name="request"></param>
        /// <param name="url"></param>
        /// <returns></returns>
        public async Task<HttpResponseMessage> ProxyGetAsync(HttpRequest request, string url)
        {
            return await ProxySendAsync(request, url, HttpMethod.Get);
        }

        /// <summary>
        /// Proxy a POST request to the specified 'url'.
        /// This will use the original requests Authorization token in the server request.
        /// </summary>
        /// <param name="request"></param>
        /// <param name="url"></param>
        /// <returns></returns>
        public async Task<HttpResponseMessage> ProxyPostAsync(HttpRequest request, string url, HttpContent content)
        {
            return await ProxySendAsync(request, url, HttpMethod.Post, content);
        }

        /// <summary>
        /// Proxy a PUT request to the specified 'url'.
        /// This will use the original requests Authorization token in the server request.
        /// </summary>
        /// <param name="request"></param>
        /// <param name="url"></param>
        /// <returns></returns>
        public async Task<HttpResponseMessage> ProxyPutAsync(HttpRequest request, string url, HttpContent content)
        {
            return await ProxySendAsync(request, url, HttpMethod.Put, content);
        }

        /// <summary>
        /// Proxy a DELETE request to the specified 'url'.
        /// This will use the original requests Authorization token in the server request.
        /// </summary>
        /// <param name="request"></param>
        /// <param name="url"></param>
        /// <returns></returns>
        public async Task<HttpResponseMessage> ProxyDeleteAsync(HttpRequest request, string url, HttpContent content)
        {
            return await ProxySendAsync(request, url, HttpMethod.Delete, content);
        }
        #endregion

        #region Service Account Requests
        /// <summary>
        /// Make a request to the Keycloak token endpoint as the Service Account.
        /// This requires configuration of the following keys.
        ///     Keycloak:ServiceAccount:Authority or Keycloak:Authority
        ///     Keycloak:ServiceAccount:Client or Keycloak:Client
        ///     Keycloak:ServiceAccount:Secret or Keycloak:Secret
        ///     Keycloak:ServiceAccount:Audience or Keycloak:Audience
        /// </summary>
        /// <returns></returns>
        public async Task<HttpResponseMessage> RequestToken()
        {
            var keycloakAuthority = _config.GetValue<string>("Keycloak:ServiceAccount:Authority") ?? _config.GetValue<string>("Keycloak:Authority") ??
                throw new ConfigurationException($"Configuration 'Keycloak:Authority' is missing or invalid.");
            var keycloakClient = _config.GetValue<string>("Keycloak:ServiceAccount:Client") ?? _config.GetValue<string>("Keycloak:Client") ??
                throw new ConfigurationException($"Configuration 'Keycloak:Client' is missing or invalid.");
            var keycloakSecret = _config.GetValue<string>("Keycloak:ServiceAccount:Secret") ?? _config.GetValue<string>("Keycloak:Secret") ??
                throw new ConfigurationException($"Configuration 'Keycloak:Secret' is missing or invalid.");
            var keycloakAudience = _config.GetValue<string>("Keycloak:ServiceAccount:Audience") ?? _config.GetValue<string>("Keycloak:Audience") ??
                throw new ConfigurationException($"Configuration 'Keycloak:Audience' is missing or invalid.");

            // Use the configuration settings if available, or make a request to Keycloak for the appropriate endpoint URL.
            var keycloakTokenUrl = _config.GetValue<string>("Keycloak:OpenIdConnect:Token");
            if (String.IsNullOrWhiteSpace(keycloakTokenUrl))
            {
                var endpoints = await GetOpenIdConnectEndpoints();
                keycloakTokenUrl = endpoints.token_endpoint;
            }
            else if (!keycloakTokenUrl.StartsWith("http"))
            {
                keycloakTokenUrl = $"{keycloakAuthority}{keycloakTokenUrl}";
            }

            using var tokenMessage = new HttpRequestMessage(HttpMethod.Post, keycloakTokenUrl);
            var p = new Dictionary<string, string>
                { { "client_id", keycloakClient },
                    { "grant_type", "client_credentials" },
                    { "client_secret", keycloakSecret },
                    { "audience", keycloakAudience }
                };
            var form = new FormUrlEncodedContent(p);
            form.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/x-www-form-urlencoded");
            tokenMessage.Content = form;
            var tokenResponse = await _client.SendAsync(tokenMessage);
            var token = String.Empty;

            return tokenResponse;
        }

        /// <summary>
        /// Make a request to the Keycloak token endpoint as the Service Account to fetch the 'access_token'.
        /// This requires configuration of the following keys.
        ///     Keycloak:ServiceAccount:Authority or Keycloak:Authority
        ///     Keycloak:ServiceAccount:Client or Keycloak:Client
        ///     Keycloak:ServiceAccount:Secret or Keycloak:Secret
        ///     Keycloak:ServiceAccount:Audience or Keycloak:Audience
        /// </summary>
        /// <exception type="Helpers.Exceptions.ApiHttpRequestException">If the request fails.</exception>
        /// <returns></returns>
        public async Task<string> RequestAccessToken()
        {
            var response = await RequestToken();

            // Extract the JWT token to use when making the request.
            if (response.IsSuccessStatusCode)
            {
                using var responseStream = await response.Content.ReadAsStreamAsync();
                var tokenResult = await JsonSerializer.DeserializeAsync<Models.Keycloak.TokenModel>(responseStream);
                return $"Bearer {tokenResult.access_token}";
            }
            else
            {
                throw new ApiHttpRequestException(response);
            }
        }

        /// <summary>
        /// Make a request to Keycloak for a token for the API Service Account.
        /// </summary>
        /// <param name="url"></param>
        /// <param name="method"></param>
        /// <param name="content"></param>
        /// <returns></returns>
        public async Task<HttpResponseMessage> SendAsync(string url, HttpMethod method, HttpContent content = null)
        {
            if (String.IsNullOrWhiteSpace(url)) throw new ArgumentException($"Argument '{nameof(url)}' must be a valid URL.");
            if (method == null) method = HttpMethod.Get;

            var token = await RequestAccessToken();

            var message = new HttpRequestMessage(method, url);
            if (!String.IsNullOrWhiteSpace(token)) message.Headers.Add("Authorization", token.ToString());
            message.Headers.Add("User-Agent", "Pims.Api");
            message.Content = content;

            return await _client.SendAsync(message);
        }

        /// <summary>
        /// Send a GET request to the specified 'url'.
        /// This will use the API Service account to fetch an access token.
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        public async Task<HttpResponseMessage> GetAsync(string url)
        {
            return await SendAsync(url, HttpMethod.Get);
        }

        /// <summary>
        /// Send a POST request to the specified 'url'.
        /// This will use the API Service account to fetch an access token.
        /// </summary>
        /// <param name="url"></param>
        /// <param name="content"></param>
        /// <returns></returns>
        public async Task<HttpResponseMessage> PostAsync(string url, HttpContent content)
        {
            return await SendAsync(url, HttpMethod.Post, content);
        }

        /// <summary>
        /// Send a PUT request to the specified 'url'.
        /// This will use the API Service account to fetch an access token.
        /// </summary>
        /// <param name="url"></param>
        /// <param name="content"></param>
        /// <returns></returns>
        public async Task<HttpResponseMessage> PutAsync(string url, HttpContent content)
        {
            return await SendAsync(url, HttpMethod.Put, content);
        }

        /// <summary>
        /// Send a DELETE request to the specified 'url'.
        /// This will use the API Service account to fetch an access token.
        /// </summary>
        /// <param name="url"></param>
        /// <param name="content"></param>
        /// <returns></returns>
        public async Task<HttpResponseMessage> DeleteAsync(string url, HttpContent content)
        {
            return await SendAsync(url, HttpMethod.Delete, content);
        }
        #endregion

        /// <summary>
        /// Dispose the HttpClient.
        /// </summary>
        public void Dispose()
        {
            _client.Dispose();
        }
        #endregion
    }
}
