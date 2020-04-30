using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Pims.Tools.Keycloak.Sync
{
    /// <summary>
    /// OpenIdConnector class, provides a way to connect with open ID connect api endpoints.
    /// </summary>
    public class OpenIdConnector : IOpenIdConnector
    {
        #region Properties
        private readonly KeycloakOptions _options;
        private readonly HttpClient _client;
        private readonly ILogger _logger;
        private readonly JsonSerializerOptions _serializationOptions = new JsonSerializerOptions()
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            IgnoreNullValues = true
        };
        #endregion

        #region Constructors
        /// <summary>
        ///
        /// </summary>
        /// <param name="optionsTool"></param>
        /// <param name="clientFactory"></param>
        /// <param name="logger"></param>
        public OpenIdConnector(IOptionsMonitor<KeycloakOptions> optionsTool, IHttpClientFactory clientFactory, ILogger<OpenIdConnector> logger)
        {
            _options = optionsTool.CurrentValue;
            _client = clientFactory.CreateClient("Pims.Tools.Keycloak.Sync");
            _logger = logger;
        }
        #endregion

        #region Methods

        /// <summary>
        /// Make an HTTP request to authenticate or to refresh the access token.
        /// </summary>
        /// <param name="refreshToken"></param>
        /// <returns></returns>
        public async Task<Models.Keycloak.TokenModel> RequestTokenAsync(string refreshToken = null)
        {
            var request = new HttpRequestMessage(HttpMethod.Post, _options.TokenUrl);
            request.Headers.Add("User-Agent", "Pims.Tools.Keycloak.Sync");

            Dictionary<string, string> keys;

            if (String.IsNullOrWhiteSpace(refreshToken))
            {
                keys = new Dictionary<string, string>
                { { "client_id", _options.ClientId },
                    { "grant_type", "client_credentials" },
                    { "client_secret", _options.ClientSecret },
                    { "audience", _options.Audience ?? _options.ClientId }
                };
            }
            else
            {
                keys = new Dictionary<string, string>
                { { "client_id", _options.ClientId },
                    { "grant_type", "refresh_token" },
                    { "client_secret", _options.ClientSecret },
                    { "refresh_token", refreshToken }
                };
            }
            var form = new FormUrlEncodedContent(keys);
            form.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/x-www-form-urlencoded");
            request.Content = form;

            var response = await _client.SendAsync(request);
            using var stream = await response.Content.ReadAsStreamAsync();

            if (response.IsSuccessStatusCode)
            {
                var token = await JsonSerializer.DeserializeAsync<Models.Keycloak.TokenModel>(stream, _serializationOptions);
                _logger.LogInformation($"Successfully requested token: {_options.TokenUrl}");
                _logger.LogTrace($"Access token: {token.Access_token}");
                return token;
            }
            else
            {
                if (response.Content.Headers.ContentType?.MediaType == "application/json")
                {
                    var results = await JsonSerializer.DeserializeAsync<object>(stream, _serializationOptions); // TODO: convert to known object to extract error message.
                    var json = JsonSerializer.Serialize(results);
                    _logger.LogError(json);
                    throw new InvalidOperationException($"Failed to fetch new token. {response.StatusCode} - {json}");
                }
                else
                {
                    using var reader = new StreamReader(stream, Encoding.UTF8);
                    var error = reader.ReadToEnd();
                    _logger.LogError(error);
                    throw new InvalidOperationException($"Failed to fetch new token. {response.StatusCode} - {error}");
                }
            }
        }
        #endregion
    }
}
