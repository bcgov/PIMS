using System.IO;
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
        /// <returns></returns>
        Task<int> ImportAsync(FileInfo file);
    }
}
