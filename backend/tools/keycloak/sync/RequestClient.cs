using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Pims.Tools.Keycloak.Sync.Configuration;
using Pims.Tools.Keycloak.Sync.Exceptions;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Pims.Tools.Keycloak.Sync
{
    /// <summary>
    /// RequestClient class, provides a way to make HTTP requests, handle errors and handle refresh tokens.
    /// </summary>
    public class RequestClient : IRequestClient
    {
        #region Variables
        private readonly ToolOptions _options;
        private readonly IOpenIdConnector _auth;
        private readonly HttpClient _client;
        private readonly JwtSecurityTokenHandler _tokenHandler;
        private readonly ILogger _logger;
        private string _token = null;
        private string _refreshToken = null;
        private readonly JsonSerializerOptions _serializeOptions = new JsonSerializerOptions()
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            IgnoreNullValues = true
        };
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of an RequestClient class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="options"></param>
        /// <param name="auth"></param>
        /// <param name="clientFactory"></param>
        /// <param name="tokenHandler"></param>
        /// <param name="logger"></param>
        public RequestClient(IOptionsMonitor<ToolOptions> options, IOpenIdConnector auth, IHttpClientFactory clientFactory, JwtSecurityTokenHandler tokenHandler, ILogger<SyncFactory> logger)
        {
            _options = options.CurrentValue;
            _auth = auth;
            _client = clientFactory.CreateClient("Pims.Tools.Keycloak.Sync");
            _tokenHandler = tokenHandler;
            _logger = logger;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Returns the full URI for the Keycloak admin API.
        /// </summary>
        /// <param name="route"></param>
        /// <returns></returns>
        public string AdminRoute(string route)
        {
            return $"{_options.Keycloak.Admin.Authority}/{route}";
        }

        /// <summary>
        /// Recursively retry after a failure based on configuration.
        /// </summary>
        /// <param name="method"></param>
        /// <param name="url"></param>
        /// <param name="attempt"></param>
        /// <returns></returns>
        public async Task<RT> RetryAsync<RT>(HttpMethod method, string url, int attempt = 1)
            where RT : class
        {
            try
            {
                return await HandleRequestAsync<RT>(method, url);
            }
            catch (HttpRequestException)
            {
                // Make another attempt;
                if (_options.Sync.RetryAfterFailure && attempt <= _options.Sync.RetryAttempts)
                {
                    _logger.LogInformation($"Retry attempt: {attempt} of {_options.Sync.RetryAttempts}");
                    return await RetryAsync<RT>(method, url, ++attempt);
                }
                else
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// Recursively retry after a failure based on configuration.
        /// </summary>
        /// <param name="method"></param>
        /// <param name="url"></param>
        /// <param name="data"></param>
        /// <param name="attempt"></param>
        /// <returns></returns>
        public async Task<RT> RetryAsync<RT, T>(HttpMethod method, string url, T data = default, int attempt = 1)
            where RT : class
            where T : class
        {
            try
            {
                return await HandleRequestAsync<RT, T>(method, url, data);
            }
            catch (HttpResponseException ex)
            {
                _logger.LogError($"Sync failed: status: {ex.StatusCode} Details: {ex.Details}");

                // Make another attempt;
                if (_options.Sync.RetryAfterFailure && attempt <= _options.Sync.RetryAttempts)
                {
                    _logger.LogInformation($"Retry attempt: {attempt} of {_options.Sync.RetryAttempts}");
                    return await RetryAsync<RT, T>(method, url, data, ++attempt);
                }
                else
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// Send an HTTP GET request.
        /// Deserialize the result into the specified 'RT' type.
        /// </summary>
        /// <param name="url"></param>
        /// <param name="onError"></param>
        /// <returns></returns>
        public async Task<RT> HandleGetAsync<RT>(string url, Func<HttpResponseMessage, bool> onError = null)
            where RT : class
        {
            var response = await SendRequestAsync(HttpMethod.Get, url);

            if (response.IsSuccessStatusCode)
            {
                using var stream = await response.Content.ReadAsStreamAsync();
                return await JsonSerializer.DeserializeAsync<RT>(stream, _serializeOptions);
            }

            // If the error handle is not provided, or if it returns false throw an error.
            if ((onError?.Invoke(response) ?? false) == false)
                throw new HttpResponseException(response);

            return null;
        }

        /// <summary>
        /// Send an HTTP request.
        /// Deserialize the result into the specified 'RT' type.
        /// </summary>
        /// <param name="method"></param>
        /// <param name="url"></param>
        /// <param name="onError"></param>
        /// <returns></returns>
        public async Task<RT> HandleRequestAsync<RT>(HttpMethod method, string url, Func<HttpResponseMessage, bool> onError = null)
            where RT : class
        {
            var response = await SendRequestAsync(method, url);

            if (response.IsSuccessStatusCode)
            {
                using var stream = await response.Content.ReadAsStreamAsync();
                return await JsonSerializer.DeserializeAsync<RT>(stream, _serializeOptions);
            }

            // If the error handle is not provided, or if it returns false throw an error.
            if ((onError?.Invoke(response) ?? false) == false)
                throw new HttpResponseException(response);

            return null;
        }

        /// <summary>
        /// Send the items in an HTTP request.
        /// Deserialize the result into the specified 'RT' type.
        /// </summary>
        /// <param name="method"></param>
        /// <param name="url"></param>
        /// <param name="data"></param>
        /// <param name="onError"></param>
        /// <returns></returns>
        public async Task<RT> HandleRequestAsync<RT, T>(HttpMethod method, string url, T data, Func<HttpResponseMessage, bool> onError = null)
            where RT : class
            where T : class
        {
            var response = await SendRequestAsync(method, url, data);

            if (response.IsSuccessStatusCode)
            {
                using var stream = await response.Content.ReadAsStreamAsync();
                return await JsonSerializer.DeserializeAsync<RT>(stream, _serializeOptions);
            }

            // If the error handle is not provided, or if it returns false throw an error.
            if ((onError?.Invoke(response) ?? false) == false)
                throw new HttpResponseException(response);

            return null;
        }

        /// <summary>
        /// Send an HTTP request.
        /// Refresh the access token if required.
        /// </summary>
        /// <param name="method"></param>
        /// <param name="url"></param>
        /// <returns></returns>
        public async Task<HttpResponseMessage> SendRequestAsync(HttpMethod method, string url)
        {
            await RefreshAccessTokenAsync();

            var request = new HttpRequestMessage(method, url);
            request.Headers.Add("Authorization", $"Bearer {_token}");
            request.Headers.Add("User-Agent", "Pims.Tools.Import");

            var response = await _client.SendAsync(request);

            return response;
        }

        /// <summary>
        /// Send the items in an HTTP request.
        /// Refresh the access token if required.
        /// </summary>
        /// <param name="method"></param>
        /// <param name="url"></param>
        /// <param name="data"></param>
        /// <returns></returns>
        public async Task<HttpResponseMessage> SendRequestAsync<T>(HttpMethod method, string url, T data)
            where T : class
        {
            await RefreshAccessTokenAsync();

            var request = new HttpRequestMessage(method, url);
            request.Headers.Add("Authorization", $"Bearer {_token}");
            request.Headers.Add("User-Agent", "Pims.Tools.Import");

            if (data != null)
            {
                var json = JsonSerializer.Serialize(data, _serializeOptions);
                request.Content = new StringContent(json, Encoding.UTF8, "application/json");
            }

            var response = await _client.SendAsync(request);

            return response;
        }

        /// <summary>
        /// Refresh the access token if required.
        /// </summary>
        /// <param name="force"></param>
        /// <returns></returns>
        public async Task RefreshAccessTokenAsync(bool force = false)
        {
            // Check if token has expired.  If it has refresh it.
            if (force || String.IsNullOrWhiteSpace(_token) || _tokenHandler.ReadJwtToken(_token).ValidTo <= DateTime.UtcNow)
            {
                var tokenNew = await _auth.RequestTokenAsync(_refreshToken);
                _token = tokenNew.Access_token;
                _refreshToken = tokenNew.Refresh_token;
            }
        }
        #endregion
    }
}
