using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

namespace Pims.Tools.Import
{
    /// <summary>
    /// IImporter interface, provides a way to iterate through a JSON array and send each iteration through an HTTP request to a configured endpoint.
    /// </summary>
    public interface IImporter
    {
        /// <summary>
        /// Read the JSON package, iterate through it and send the items to the specified endpoint URL.
        /// </summary>
        /// <param name="file">The JSON file containing an array of items.</param>
        /// <param name="url">API endpoint to send HTTP requests to.</param>
        /// <param name="method">HTTP method to use.</param>
        /// <param name="token">The JWT token, if not provided a request will be made for one.</param>
        /// <returns></returns>
        Task<int> ImportAsync(FileInfo file, HttpMethod method, string url, string token = null);
    }
}
