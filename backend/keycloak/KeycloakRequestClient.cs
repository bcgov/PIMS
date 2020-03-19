using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using keycloak.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Pims.Keycloak.Exceptions;

namespace Pims.Keycloak
{
    /// <summary>
    /// KeycloakRequestClient class, provides a way to make HTTP requests on behalf of the frontend application to keycloak.
    /// </summary>
    public sealed class KeycloakRequestClient : IKeycloakRequestClient, IDisposable
    {
        #region Variables
        private readonly HttpClient _client;
        #endregion

        #region Properties
        /// <summary>
        /// get - The configuration options for keycloak.
        /// </summary>
        /// <value></value>
        public Configuration.KeycloakOptions Options { get; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a KeycloakRequestClient class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="clientFactory"></param>
        /// <param name="optionsKeycloak"></param>
        public KeycloakRequestClient(IHttpClientFactory clientFactory, IOptionsMonitor<Configuration.KeycloakOptions> optionsKeycloak)
        {
            _client = clientFactory.CreateClient();
            this.Options = optionsKeycloak.CurrentValue;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Make a request to fetch the Keycloak OpenIdConnect endpoints.
        /// </summary>
        /// <returns></returns>
        public async Task<Models.OpenIdConnectModel> GetOpenIdConnectEndpoints()
        {
            var keycloakAuthority = this.Options.Authority ??
                throw new ConfigurationException($"Configuration 'Keycloak:Authority' is missing or invalid.");

            var response = await _client.GetAsync($"{keycloakAuthority}/.well-known/openid-configuration");

            if (response.IsSuccessStatusCode)
            {
                using var responseStream = await response.Content.ReadAsStreamAsync();
                return await responseStream.DeserializeAsync<Models.OpenIdConnectModel>();
            }
            else
            {
                throw new KeycloakRequestException(response);
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
        public async Task<HttpResponseMessage> ProxyPostAsync(HttpRequest request, string url, HttpContent content = null)
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
        public async Task<HttpResponseMessage> ProxyPutAsync(HttpRequest request, string url, HttpContent content = null)
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
        public async Task<HttpResponseMessage> ProxyDeleteAsync(HttpRequest request, string url, HttpContent content = null)
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
            var keycloakAuthority = this.Options.ServiceAccount.Authority ?? this.Options.Authority ??
                throw new ConfigurationException($"Configuration 'Keycloak:Authority' is missing or invalid.");
            var keycloakClient = this.Options.ServiceAccount.Client ?? this.Options.Client ??
                throw new ConfigurationException($"Configuration 'Keycloak:Client' is missing or invalid.");
            var keycloakSecret = this.Options.ServiceAccount.Secret ?? this.Options.Secret ??
                throw new ConfigurationException($"Configuration 'Keycloak:Secret' is missing or invalid.");
            var keycloakAudience = this.Options.ServiceAccount.Audience ?? this.Options.Audience ??
                throw new ConfigurationException($"Configuration 'Keycloak:Audience' is missing or invalid.");

            // Use the configuration settings if available, or make a request to Keycloak for the appropriate endpoint URL.
            var keycloakTokenUrl = this.Options.OpenIdConnect.Token;
            if (String.IsNullOrWhiteSpace(keycloakTokenUrl))
            {
                var endpoints = await GetOpenIdConnectEndpoints();
                keycloakTokenUrl = endpoints.Token_endpoint;
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
            return await _client.SendAsync(tokenMessage);
        }

        /// <summary>
        /// Make a request to the Keycloak token endpoint as the Service Account to fetch the 'access_token'.
        /// This requires configuration of the following keys.
        ///     Keycloak:ServiceAccount:Authority or Keycloak:Authority
        ///     Keycloak:ServiceAccount:Client or Keycloak:Client
        ///     Keycloak:ServiceAccount:Secret or Keycloak:Secret
        ///     Keycloak:ServiceAccount:Audience or Keycloak:Audience
        /// </summary>
        /// <exception type="Helpers.Exceptions.KeycloakRequestException">If the request fails.</exception>
        /// <returns></returns>
        public async Task<string> RequestAccessToken()
        {
            var response = await RequestToken();

            // Extract the JWT token to use when making the request.
            if (response.IsSuccessStatusCode)
            {
                using var responseStream = await response.Content.ReadAsStreamAsync();
                var tokenResult = await responseStream.DeserializeAsync<Models.TokenModel>();
                return $"Bearer {tokenResult.Access_token}";
            }
            else
            {
                throw new KeycloakRequestException(response);
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

            var token = await RequestAccessToken(); // TODO: Find way to cache this so that it isn't a separate request every time.

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
        public async Task<HttpResponseMessage> PostAsync(string url, HttpContent content = null)
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
        public async Task<HttpResponseMessage> PutAsync(string url, HttpContent content = null)
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
        public async Task<HttpResponseMessage> DeleteAsync(string url, HttpContent content = null)
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
