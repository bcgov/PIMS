using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Pims.Core.Exceptions;
using Pims.Core.Http.Configuration;
using Pims.Tools.Core.Configuration;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Pims.Tools.Core
{
    /// <summary>
    /// RequestClient class, provides a way to make HTTP requests, handle errors and handle refresh tokens.
    /// </summary>
    public class RequestClient : Pims.Core.Http.OpenIdConnectRequestClient, IRequestClient
    {
        #region Variables
        private readonly RequestOptions _requestOptions;
        private readonly ILogger _logger;
        private readonly JsonSerializerOptions _serializerOptions;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of an RequestClient class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="clientFactory"></param>
        /// <param name="tokenHandler"></param>
        /// <param name="authClientOptions"></param>
        /// <param name="openIdConnectOptions"></param>
        /// <param name="requestOptions"></param>
        /// <param name="serializerOptions"></param>
        /// <param name="logger"></param>
        public RequestClient(
            IHttpClientFactory clientFactory,
            JwtSecurityTokenHandler tokenHandler,
            IOptionsMonitor<AuthClientOptions> authClientOptions,
            IOptionsMonitor<OpenIdConnectOptions> openIdConnectOptions,
            IOptionsMonitor<RequestOptions> requestOptions,
            IOptionsMonitor<JsonSerializerOptions> serializerOptions,
            ILogger<RequestClient> logger)
            : base(clientFactory, tokenHandler, authClientOptions, openIdConnectOptions, serializerOptions, logger)
        {
            _requestOptions = requestOptions.CurrentValue;
            _logger = logger;
            _serializerOptions = serializerOptions?.CurrentValue ?? new JsonSerializerOptions()
            {
                PropertyNameCaseInsensitive = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                IgnoreNullValues = true
            };
        }
        #endregion

        #region Methods
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
            catch (HttpClientRequestException)
            {
                // Make another attempt;
                if (_requestOptions.RetryAfterFailure && attempt <= _requestOptions.RetryAttempts)
                {
                    _logger.LogInformation($"Retry attempt: {attempt} of {_requestOptions.RetryAttempts}");
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
            catch (HttpClientRequestException ex)
            {
                _logger.LogError($"Request failed: status: {ex.StatusCode} Details: {ex.Message}");

                // Make another attempt;
                if (_requestOptions.RetryAfterFailure && attempt <= _requestOptions.RetryAttempts)
                {
                    _logger.LogInformation($"Retry attempt: {attempt} of {_requestOptions.RetryAttempts}");
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
            var response = await base.SendAsync(url, HttpMethod.Get);

            if (response.IsSuccessStatusCode)
            {
                using var stream = await response.Content.ReadAsStreamAsync();
                return await JsonSerializer.DeserializeAsync<RT>(stream, _serializerOptions);
            }

            // If the error handle is not provided, or if it returns false throw an error.
            if ((onError?.Invoke(response) ?? false) == false)
                throw new HttpClientRequestException(response);

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
            var response = await base.SendAsync(url, method);

            if (response.IsSuccessStatusCode)
            {
                using var stream = await response.Content.ReadAsStreamAsync();
                return await JsonSerializer.DeserializeAsync<RT>(stream, _serializerOptions);
            }

            // If the error handle is not provided, or if it returns false throw an error.
            if ((onError?.Invoke(response) ?? false) == false)
                throw new HttpClientRequestException(response);

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
            StringContent body = null;
            if (data != null)
            {
                var json = JsonSerializer.Serialize(data, _serializerOptions);
                body = new StringContent(json, Encoding.UTF8, "application/json");
            }

            var response = await base.SendAsync(url, method, body);

            if (response.IsSuccessStatusCode)
            {
                using var stream = await response.Content.ReadAsStreamAsync();
                return await JsonSerializer.DeserializeAsync<RT>(stream, _serializerOptions);
            }

            // If the error handle is not provided, or if it returns false throw an error.
            if ((onError?.Invoke(response) ?? false) == false)
                throw new HttpClientRequestException(response);

            return null;
        }
        #endregion
    }
}
