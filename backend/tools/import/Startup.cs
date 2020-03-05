using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Pims.Tools.Import
{
    /// <summary>
    /// Startup class, provides the application starting point to run the console app.
    /// </summary>
    public class Startup
    {
        #region Variables
        private readonly ILogger _logger;
        private readonly IConfiguration _configuration;

        private readonly HttpClient _client = new HttpClient();
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a Startup class, initializes it with the specified arguments.
        /// </summary>
        /// <param name="config"></param>
        /// <param name="logger"></param>
        public Startup(IConfiguration config, ILogger<Startup> logger)
        {
            _configuration = config;
            _logger = logger;
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

            var filePath = _configuration.GetSection("Import:File").Value;
            var file = new FileInfo(filePath);
            var url = _configuration.GetSection("Api:Url").Value;
            var token = _configuration.GetSection("Api:Token").Value;
            var method = _configuration.GetSection("Api:Method")?.Value?? "POST";
            int.TryParse(_configuration.GetSection("Import:Quantity").Value, out int quantity);
            int.TryParse(_configuration.GetSection("Import:Delay").Value, out int delay);

            _logger.LogInformation($"Run file: {file}");

            return await ImportAsync(file, GetMethod(method), url, token, quantity, delay);
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
        private async Task<int> ImportAsync(FileInfo file, HttpMethod method, string url, string token, int quantity, int delay)
        {
            if (file == null) throw new ArgumentNullException(nameof(file));
            if (!file.Exists) throw new ArgumentException($"Argument '{nameof(file)}' must be an existing file.");
            if (String.IsNullOrWhiteSpace(url)) throw new ArgumentException($"Argument '{nameof(url)}' is required.");
            if (String.IsNullOrWhiteSpace(token)) throw new ArgumentException($"Argument '{nameof(token)}' is required.");

            _logger.LogInformation($"url: {url}, quantity: {quantity}");

            var properties = await JsonSerializer.DeserializeAsync<IEnumerable<object>>(file.OpenRead());
            var iteration = 0;
            var total = properties.Count();

            _logger.LogInformation($"Properties in file {total}");

            while (total > iteration * quantity)
            {
                var items = properties.Skip(iteration).Take(quantity);

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
                        _logger.LogError(json);
                    }
                    else
                    {
                        var readStream = new StreamReader(stream, Encoding.UTF8);
                        var error = readStream.ReadToEnd();
                        _logger.LogError(error);
                    }
                }

                await Task.Delay(new TimeSpan(0, 0, delay));

                iteration++;
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
            request.Headers.Add("User-Agent", "pims.tools.import");
            request.Content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _client.SendAsync(request);

            return response;
        }
    }
}
