using System.Threading.Tasks;

namespace Pims.Tools.Import
{
    /// <summary>
    /// IOpenIdConnector interface, provides a way to connect with open ID connect api endpoints.
    /// </summary>
    public interface IOpenIdConnector
    {
        /// <summary>
        /// Make a request to fetch a new token.
        /// </summary>
        /// <param name="refreshToken"></param>
        /// <returns></returns>
        Task<Models.TokenModel> RequestTokenAsync(string refreshToken = null);
    }
}
