using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Pims.Tools.Import
{
    /// <summary>
    /// Importer class, provides a way to iterate through a JSON array and send each iteration through an HTTP request to a configured endpoint.
    /// </summary>
    public class Importer : IImporter
    {
        #region Variables
        private readonly ImportOptions _options;
        private readonly IOpenIdConnector _auth;
        private readonly HttpClient _client;
        private readonly JwtSecurityTokenHandler _tokenHandler;
        private readonly ILogger _logger;
        private string _refreshToken = null;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of an Importer class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="options"></param>
        /// <param name="auth"></param>
        /// <param name="clientFactory"></param>
        /// <param name="tokenHandler"></param>
        /// <param name="logger"></param>
        public Importer(IOptionsMonitor<ImportOptions> options, IOpenIdConnector auth, IHttpClientFactory clientFactory, JwtSecurityTokenHandler tokenHandler, ILogger<Importer> logger)
        {
            _options = options.CurrentValue;
            _auth = auth;
            _client = clientFactory.CreateClient("Pims.Tools.Import");
            _tokenHandler = tokenHandler;
            _logger = logger;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Read the JSON package, iterate through it and send the items to the configured endpoint URL.
        /// </summary>
        /// <param name="file"></param>
        /// <param name="url"></param>
        /// <param name="method"></param>
        /// <param name="token"></param>
        /// <returns></returns>
        public async Task<int> ImportAsync(FileInfo file, HttpMethod method, string url, string token = null)
        {
            if (file == null) throw new ArgumentNullException(nameof(file));
            if (!file.Exists) throw new ArgumentException($"Argument '{nameof(file)}' must be an existing file.");
            if (String.IsNullOrWhiteSpace(url)) throw new ArgumentException($"Argument '{nameof(url)}' is required.");

            _logger.LogInformation($"url: {url}, quantity: {_options.Quantity}");

            var properties = await JsonSerializer.DeserializeAsync<IEnumerable<object>>(file.OpenRead());
            var index = _options.Skip;
            var total = properties.Count();
            var failures = 0;
            var iteration = 0;

            _logger.LogInformation($"Properties in file {total}");

            while (total > index)
            {
                var items = properties.Skip(index).Take(_options.Quantity);

                _logger.LogInformation($"Import iteration: {iteration}, Properties remaining: {total - index}");

                // Check if token has expired.  If it has refresh it.
                if (String.IsNullOrWhiteSpace(token) || _tokenHandler.ReadJwtToken(token).ValidTo <= DateTime.UtcNow)
                {
                    var tokenNew = await _auth.RequestTokenAsync(_refreshToken);
                    token = tokenNew.access_token;
                    _refreshToken = tokenNew.refresh_token;
                }

                var success = await RetryAsync(method, url, token, items);
                failures = success ? 0 : failures + 1;

                // Failed request, abort the importer.
                if (failures >= _options.AbortAfterFailure)
                    return 1;

                // Exit the import, we're done.
                if (_options.Iterations > 0 && ++iteration >= _options.Iterations)
                    break;

                index += _options.Quantity;
            }

            return 0;
        }

        /// <summary>
        /// Recursively retry after a failure based on configuration.
        /// </summary>
        /// <param name="method"></param>
        /// <param name="url"></param>
        /// <param name="token"></param>
        /// <param name="items"></param>
        /// <param name="attempt"></param>
        /// <returns></returns>
        private async Task<bool> RetryAsync(HttpMethod method, string url, string token, IEnumerable<object> items, int attempt = 1)
        {
            var success = await SendItemsAsync(method, url, token, items);

            // Make another attempt;
            if (!success && _options.RetryAfterFailure && attempt <= _options.RetryAttempts)
            {
                _logger.LogInformation($"Retry attempt: {attempt} of {_options.RetryAttempts}");
                return await RetryAsync(method, url, token, items, ++attempt);
            }

            return success;
        }

        /// <summary>
        /// Send the items in an HTTP request.
        /// </summary>
        /// <param name="method"></param>
        /// <param name="url"></param>
        /// <param name="token"></param>
        /// <param name="items"></param>
        /// <returns></returns>
        private async Task<bool> SendItemsAsync(HttpMethod method, string url, string token, IEnumerable<object> items)
        {
            if (_options.Delay > 0)
                Task.Delay(new TimeSpan(0, 0, 0, 0, _options.Delay)).Wait();

            var response = await SendAsync(method, url, token, items);
            using var stream = await response.Content.ReadAsStreamAsync();

            if (response.IsSuccessStatusCode)
            {
                var results = await JsonSerializer.DeserializeAsync<IEnumerable<object>>(stream);
                _logger.LogInformation($"Successfully imported items: {results.Count()}");
                return true;
            }

            if (response.Content.Headers.ContentType == new MediaTypeHeaderValue("application/json"))
            {
                var results = await JsonSerializer.DeserializeAsync<object>(stream);
                var json = JsonSerializer.Serialize(results);
                _logger.LogError($"Import failed: status: {response.StatusCode} Details: {json}");
            }
            else
            {
                var readStream = new StreamReader(stream);
                var error = readStream.ReadToEnd();
                _logger.LogError($"Import failed: status: {response.StatusCode} Details: {error}");
            }

            return false;
        }

        /// <summary>
        /// Make an HTTP request to the configured endpoint URL.
        /// </summary>
        /// <param name="url"></param>
        /// <param name="token"></param>
        /// <param name="items"></param>
        /// <param name="method"></param>
        /// <returns></returns>
        private async Task<HttpResponseMessage> SendAsync(HttpMethod method, string url, string token, IEnumerable<object> items)
        {
            var json = JsonSerializer.Serialize(items);

            _logger.LogInformation($"Sending {items.Count()} items to {url}");

            var request = new HttpRequestMessage(method, url);
            request.Headers.Add("Authorization", $"Bearer {token}");
            request.Headers.Add("User-Agent", "Pims.Tools.Import");
            request.Content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _client.SendAsync(request);

            return response;
        }
        #endregion
    }
}
