using Microsoft.Extensions.Options;
using Pims.Core.Exceptions;
using Pims.Core.Extensions;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Pims.Core.Http.Configuration;

namespace Pims.Core.Http
{
    public class OpenIdConnectRequestClient : IOpenIdConnectRequestClient
    {
        #region Properties
        /// <summary>
        /// get - The configuration options.
        /// </summary>
        public AuthClientOptions AuthClientOptions { get; }
        /// <summary>
        /// get - The configuration options.
        /// </summary>
        public OpenIdConnectOptions OpenIdConnectOptions { get; }

        /// <summary>
        /// get/set - The HttpClient use to make requests.
        /// </summary>
        protected HttpClient Client { get; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a KeycloakRequestClient class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="clientFactory"></param>
        /// <param name="authClientOptions"></param>
        /// <param name="openIdConnectOptions"></param>
        public OpenIdConnectRequestClient(IHttpClientFactory clientFactory, IOptionsMonitor<AuthClientOptions> authClientOptions, IOptionsMonitor<OpenIdConnectOptions> openIdConnectOptions)
        {
            this.Client = clientFactory.CreateClient();
            this.AuthClientOptions = authClientOptions.CurrentValue;
            this.OpenIdConnectOptions = openIdConnectOptions.CurrentValue;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Make a request to fetch the OpenIdConnect endpoints.
        /// </summary>
        /// <returns></returns>
        public async Task<Models.OpenIdConnectModel> GetOpenIdConnectEndpoints()
        {
            var authority = this.AuthClientOptions.Authority ??
                throw new ConfigurationException($"Configuration 'OpenIdConnect:Authority' is missing or invalid.");

            var response = await this.Client.GetAsync($"{authority}/.well-known/openid-configuration");

            if (response.IsSuccessStatusCode)
            {
                using var responseStream = await response.Content.ReadAsStreamAsync();
                return await responseStream.DeserializeAsync<Models.OpenIdConnectModel>();
            }
            else
            {
                throw new HttpClientRequestException(response);
            }
        }

        /// <summary>
        /// Make a request to the OpenIdConnect token endpoint as the Service Account to fetch the 'access_token'.
        /// This requires configuration of the following keys.
        ///     OpenIdConnect:Authority
        ///     OpenIdConnect:Client
        ///     OpenIdConnect:Secret
        ///     OpenIdConnect:Audience
        /// </summary>
        /// <exception type="Helpers.Exceptions.HttpClientRequestException">If the request fails.</exception>
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
                throw new HttpClientRequestException(response);
            }
        }

        #region Service Account Requests
        /// <summary>
        /// Make a request to the OpenIdConnect token endpoint as the Service Account.
        /// This requires configuration of the following keys.
        ///     OpenIdConnect:Authority
        ///     OpenIdConnect:Client
        ///     OpenIdConnect:Secret
        ///     OpenIdConnect:Audience
        /// </summary>
        /// <returns></returns>
        public async Task<HttpResponseMessage> RequestToken()
        {
            var authority = this.AuthClientOptions.Authority ??
                throw new ConfigurationException($"Configuration 'OpenIdConnect:Authority' is missing or invalid.");
            var keycloakClient = this.AuthClientOptions.Client ??
                throw new ConfigurationException($"Configuration 'OpenIdConnect:Client' is missing or invalid.");
            var keycloakSecret = this.AuthClientOptions.Secret ??
                throw new ConfigurationException($"Configuration 'OpenIdConnect:Secret' is missing or invalid.");
            var keycloakAudience = this.AuthClientOptions.Audience ??
                throw new ConfigurationException($"Configuration 'OpenIdConnect:Audience' is missing or invalid.");

            // Use the configuration settings if available, or make a request to Keycloak for the appropriate endpoint URL.
            var keycloakTokenUrl = this.OpenIdConnectOptions.Token;
            if (String.IsNullOrWhiteSpace(keycloakTokenUrl))
            {
                var endpoints = await GetOpenIdConnectEndpoints();
                keycloakTokenUrl = endpoints.Token_endpoint;
            }
            else if (!keycloakTokenUrl.StartsWith("http"))
            {
                keycloakTokenUrl = $"{authority}{keycloakTokenUrl}";
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
            return await this.Client.SendAsync(tokenMessage);
        }
        #endregion


        #region Send Methods
        /// <summary>
        /// Make a request to Keycloak for a token for the API Service Account.
        /// </summary>
        /// <param name="url"></param>
        /// <param name="method"></param>
        /// <param name="content"></param>
        /// <returns></returns>
        public virtual async Task<HttpResponseMessage> SendAsync(string url, HttpMethod method, HttpContent content = null)
        {
            if (String.IsNullOrWhiteSpace(url)) throw new ArgumentException($"Argument '{nameof(url)}' must be a valid URL.");
            if (method == null) method = HttpMethod.Get;

            var token = await RequestAccessToken(); // TODO: Find way to cache this so that it isn't a separate request every time.

            var message = new HttpRequestMessage(method, url);
            if (!String.IsNullOrWhiteSpace(token)) message.Headers.Add("Authorization", token.ToString());
            message.Headers.Add("User-Agent", "Pims.Api");
            message.Content = content;

            return await this.Client.SendAsync(message);
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
        #endregion
    }
}
