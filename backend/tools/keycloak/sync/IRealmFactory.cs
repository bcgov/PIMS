using System.Threading.Tasks;

namespace Pims.Tools.Keycloak.Sync
{
    /// <summary>
    /// IRealmFactory interface, provides a way to initialize Keycloak with the specified configuration.
    /// </summary>
    public interface IRealmFactory
    {
        /// <summary>
        /// Initialize the Keycloak realm as specified in the configuration.
        /// </summary>
        /// <returns></returns>
        Task<int> InitAsync();
    }
}
