using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace api.Helpers.Extensions
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
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static async Task<IActionResult> HandleResponseAsync<T>(this HttpResponseMessage response)
        {
            if (response.IsSuccessStatusCode)
            {
                using var responseStream = await response.Content.ReadAsStreamAsync();
                var results = await JsonSerializer.DeserializeAsync<T>(responseStream);
                return new JsonResult(results);
            }
            else
            {
                return new StatusCodeResult((int)response.StatusCode);
            }
        }
    }
}
