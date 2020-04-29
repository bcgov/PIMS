using System.Threading.Tasks;

namespace Pims.Tools.Keycloak.Sync
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
        Task<Models.Keycloak.TokenModel> RequestTokenAsync(string refreshToken = null);
    }
}
