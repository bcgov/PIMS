using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Pims.Tools.Import
{
    /// <summary>
    /// Startup class, provides the application starting point to run the console app.
    /// </summary>
    public class Startup
    {
        #region Variables
        private readonly ILogger _logger;
        private readonly ToolOptions _config;
        private readonly HttpClient _client = new HttpClient();
        private readonly JwtSecurityTokenHandler _tokenHandler;
        private string _refreshToken = null;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a Startup class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="optionsTool"></param>
        /// <param name="logger"></param>
        /// <param name="tokenHandler"></param>
        public Startup(IOptionsMonitor<ToolOptions> optionsTool, ILogger<Startup> logger, JwtSecurityTokenHandler tokenHandler)
        {
            _config = optionsTool.CurrentValue;
            _logger = logger;
            _tokenHandler = tokenHandler;
        }
        #endregion

        /// <summary>
        /// Run the console application.
        /// </summary>
        /// <param name="args"></param>
        /// <return></return>
        public async Task<int> Run(string[] args)
        {
            _logger.LogInformation("Import Started");

            var file = new FileInfo(_config.Import.File);
            _logger.LogInformation($"Import file: {file}");

            return await ImportAsync(file, GetMethod(_config.Api.HttpMethod), _config.Api.ImportUrl, _config.Api.AccessToken, _config.Import.Quantity, _config.Import.Delay);
        }

        /// <summary>
        /// Determine what HTTP method to use.
        /// </summary>
        /// <param name="method"></param>
        /// <return></return>
        private static HttpMethod GetMethod(string method)
        {
            switch (method?.ToLower())
            {
                case ("get"):
                    return HttpMethod.Get;
                case ("delete"):
                    return HttpMethod.Delete;
                case ("put"):
                    return HttpMethod.Put;
                case ("post"):
                default:
                    return HttpMethod.Post;
            }
        }

        /// <summary>
        /// Read the JSON package, iterate through it and send the items to the configured endpoint URL.
        /// </summary>
        /// <param name="file"></param>
        /// <param name="url"></param>
        /// <param name="method"></param>
        /// <param name="token"></param>
        /// <param name="quantity"></param>
        /// <param name="delay"></param>
        /// <returns></returns>
        private async Task<int> ImportAsync(FileInfo file, HttpMethod method, string url, string token = null, int quantity = 50, int delay = 0)
        {
            if (file == null) throw new ArgumentNullException(nameof(file));
            if (!file.Exists) throw new ArgumentException($"Argument '{nameof(file)}' must be an existing file.");
            if (String.IsNullOrWhiteSpace(url)) throw new ArgumentException($"Argument '{nameof(url)}' is required.");

            _logger.LogInformation($"url: {url}, quantity: {quantity}");

            var properties = await JsonSerializer.DeserializeAsync<IEnumerable<object>>(file.OpenRead());
            var index = 0;
            var total = properties.Count();

            _logger.LogInformation($"Properties in file {total}");

            while (total > index)
            {
                var items = properties.Skip(index).Take(quantity);

                _logger.LogInformation($"Properties remaining: {total - index} ");

                // Check if token has expired.  If it has refresh it.
                if (String.IsNullOrWhiteSpace(token) || _tokenHandler.ReadJwtToken(token).ValidTo <= DateTime.UtcNow)
                {
                    var tokenNew = await RequestTokenAsync(_refreshToken);
                    token = tokenNew.access_token;
                    _refreshToken = tokenNew.refresh_token;
                }

                var response = await RequestAsync(method, url, token, items);
                using var stream = await response.Content.ReadAsStreamAsync();

                if (response.IsSuccessStatusCode)
                {
                    var results = await JsonSerializer.DeserializeAsync<IEnumerable<object>>(stream);
                    _logger.LogInformation($"Successfully imported items: {results.Count()}");
                }
                else
                {
                    if (response.Content.Headers.ContentType == new MediaTypeHeaderValue("application/json"))
                    {
                        var results = await JsonSerializer.DeserializeAsync<object>(stream);
                        var json = JsonSerializer.Serialize(results);
                        _logger.LogError($"Import failed: status: {response.StatusCode} {json}");
                    }
                    else
                    {
                        var readStream = new StreamReader(stream);
                        var error = readStream.ReadToEnd();
                        _logger.LogError($"Import failed: status: {response.StatusCode} {error}");
                    }
                }

                if (delay > 0)
                    Task.Delay(new TimeSpan(0, 0, delay)).Wait();

                index = index + quantity;
            }

            return 0;
        }

        /// <summary>
        /// Make an HTTP request to the configured endpoint URL.
        /// </summary>
        /// <param name="url"></param>
        /// <param name="token"></param>
        /// <param name="items"></param>
        /// <param name="method"></param>
        /// <returns></returns>
        private async Task<HttpResponseMessage> RequestAsync(HttpMethod method, string url, string token, IEnumerable<object> items)
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

        /// <summary>
        /// Make an HTTP request to authenticate or to refresh the access token.
        /// </summary>
        /// <param name="refreshToken"></param>
        /// <returns></returns>
        private async Task<Models.TokenModel> RequestTokenAsync(string refreshToken = null)
        {
            var request = new HttpRequestMessage(HttpMethod.Post, _config.Keycloak?.TokenUrl);
            request.Headers.Add("User-Agent", "Pims.Tools.Import");

            Dictionary<string, string> keys = new Dictionary<string, string>();

            if (String.IsNullOrWhiteSpace(refreshToken))
            {
                keys = new Dictionary<string, string>
                { { "client_id", _config.Keycloak?.ClientId },
                    { "grant_type", "client_credentials" },
                    { "client_secret", _config.Keycloak?.ClientSecret },
                    { "audience", _config.Keycloak?.Audience ?? _config.Keycloak?.ClientId }
                };
            }
            else
            {
                keys = new Dictionary<string, string>
                { { "client_id", _config.Keycloak?.ClientId },
                    { "grant_type", "refresh_token" },
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
                var token = await JsonSerializer.DeserializeAsync<Models.TokenModel>(stream);
                _logger.LogInformation($"Successfully requested token: {token.access_token}");
                return token;
            }
            else
            {
                if (response.Content.Headers.ContentType?.MediaType == "application/json")
                {
                    var results = await JsonSerializer.DeserializeAsync<object>(stream);
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
    }
}
