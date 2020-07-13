using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Pims.Api.Helpers.Extensions
{
    /// <summary>
    /// HttpResponseMessageExtensions static class, provides extension methods to help with HttpResponseMessageExtensions objects.
    /// </summary>
    public static class HttpResponseMessageExtensions
    {
        /// <summary>
        /// Deserialize the response and return it as JSON, or return the failed response status to the original requester.
        /// </summary>
        /// <param name="response"></param>
        /// <param name="logger"></param>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static async Task<IActionResult> HandleResponseAsync<T>(this HttpResponseMessage response, ILogger logger = null)
        {
            if (response.IsSuccessStatusCode)
            {
                using var responseStream = await response.Content.ReadAsStreamAsync();
                var data = await JsonSerializer.DeserializeAsync<T>(responseStream);
                return new JsonResult(data)
                {
                    StatusCode = (int)response.StatusCode
                };
            }
            else
            {
                using var responseStream = await response.Content.ReadAsStreamAsync();

                var readStream = new StreamReader(responseStream, Encoding.UTF8);
                var error = readStream.ReadToEnd();
                logger?.LogError(error);
                responseStream.Position = 0;

                if (response.Content.Headers.ContentType.MediaType == "application/json")
                {
                    var data = await JsonSerializer.DeserializeAsync<object>(responseStream);
                    var result = new JsonResult(data)
                    {
                        StatusCode = (int)response.StatusCode
                    };
                    return result;
                }
                else
                {
                    var result = new JsonResult(new Models.ErrorResponseModel(error, null))
                    {
                        StatusCode = (int)response.StatusCode
                    };
                    return result;
                }
            }
        }
    }
}
