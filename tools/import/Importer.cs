using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Pims.Core.Exceptions;
using Pims.Core.Extensions;
using Pims.Tools.Core.Keycloak;

namespace Pims.Tools.Import
{
    /// <summary>
    /// Importer class, provides a way to iterate through a JSON array and send each iteration through an HTTP request to a configured endpoint.
    /// </summary>
    public class Importer : IImporter
    {
        #region Variables
        private readonly ToolOptions _options;
        private readonly IKeycloakRequestClient _client;
        private readonly ILogger _logger;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of an Importer class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="options"></param>
        /// <param name="client"></param>
        /// <param name="logger"></param>
        public Importer(IOptionsMonitor<ToolOptions> options, IKeycloakRequestClient client, ILogger<Importer> logger)
        {
            _options = options.CurrentValue;
            _client = client;
            _logger = logger;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Read the JSON package, iterate through it and send the items to the configured endpoint URL.
        /// </summary>
        /// <param name="file"></param>
        /// <returns></returns>
        public async Task<int> ImportAsync(FileInfo file)
        {
            if (file == null) throw new ArgumentNullException(nameof(file));
            if (!file.Exists) throw new ArgumentException($"Argument '{nameof(file)}' must be an existing file.");
            if (String.IsNullOrWhiteSpace(_options.Api.Uri)) throw new InvalidOperationException($"Configuration 'Api:Uri' is required.");
            if (String.IsNullOrWhiteSpace(_options.Api.ImportUrl)) throw new InvalidOperationException($"Configuration 'Api:ImportUrl' is required.");

            // Activate the service account.
            var aRes = await _client.SendAsync($"{_options.Api.Uri}/auth/activate", HttpMethod.Post);
            if (!aRes.IsSuccessStatusCode) throw new HttpClientRequestException(aRes);

            _logger.LogInformation($"url: {_options.Api.ImportUrl}, quantity: {_options.Import.Quantity}");

            var properties = await JsonSerializer.DeserializeAsync<IEnumerable<object>>(file.OpenRead());
            var index = _options.Import.Skip;
            var total = properties.Count();
            var failures = 0;
            var iteration = 0;

            _logger.LogInformation($"Items in file {total}");

            while (total > index)
            {
                var items = properties.Skip(index).Take(_options.Import.Quantity);

                _logger.LogInformation($"Import iteration: {iteration}, Items remaining: {total - index}");

                var success = await RetryAsync(_options.Api.HttpMethod.GetHttpMethod(), $"{_options.Api.Uri}{_options.Api.ImportUrl}", items);
                failures = success ? 0 : failures + 1;

                // Failed request, abort the importer.
                if (failures >= _options.AbortAfterFailure)
                    return 1;

                // Exit the import, we're done.
                if (_options.Import.Iterations > 0 && ++iteration >= _options.Import.Iterations)
                    break;

                index += _options.Import.Quantity;
            }

            return 0;
        }

        /// <summary>
        /// Recursively retry after a failure based on configuration.
        /// </summary>
        /// <param name="method"></param>
        /// <param name="url"></param>
        /// <param name="items"></param>
        /// <param name="attempt"></param>
        /// <returns></returns>
        private async Task<bool> RetryAsync(HttpMethod method, string url, IEnumerable<object> items, int attempt = 1)
        {
            var success = await SendItemsAsync(method, url, items);

            // Make another attempt;
            if (!success && _options.RetryAfterFailure && attempt <= _options.RetryAttempts)
            {
                _logger.LogInformation($"Retry attempt: {attempt} of {_options.RetryAttempts}");
                return await RetryAsync(method, url, items, ++attempt);
            }

            return success;
        }

        /// <summary>
        /// Send the items in an HTTP request.
        /// </summary>
        /// <param name="method"></param>
        /// <param name="url"></param>
        /// <param name="items"></param>
        /// <returns></returns>
        private async Task<bool> SendItemsAsync(HttpMethod method, string url, IEnumerable<object> items)
        {
            if (_options.Import.Delay > 0)
                Task.Delay(new TimeSpan(0, 0, 0, 0, _options.Import.Delay)).Wait();

            var response = await SendAsync(method, url, items);
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
        /// <param name="items"></param>
        /// <param name="method"></param>
        /// <returns></returns>
        private async Task<HttpResponseMessage> SendAsync(HttpMethod method, string url, IEnumerable<object> items)
        {
            _logger.LogInformation($"Sending {items.Count()} items to {url}");

            return await _client.SendJsonAsync(url, method, items);
        }
        #endregion
    }
}
