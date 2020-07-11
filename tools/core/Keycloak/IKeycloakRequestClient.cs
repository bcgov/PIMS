namespace Pims.Tools.Core.Keycloak
{
    /// <summary>
    /// IRequestClient interface, provides an HTTP client to make requests and handle refresh token.
    /// </summary>
    public interface IKeycloakRequestClient : IRequestClient
    {
        /// <summary>
        /// Returns the full URI for the Keycloak admin API.
        /// </summary>
        /// <param name="route"></param>
        /// <returns></returns>
        string AdminRoute(string route = null);
    }
}
