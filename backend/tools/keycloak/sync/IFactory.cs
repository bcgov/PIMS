using System.Threading.Tasks;

namespace Pims.Tools.Keycloak.Sync
{
    /// <summary>
    /// IFactory interface, provides a way to sync PIMS with Keycloak.
    /// </summary>
    public interface IFactory
    {
        /// <summary>
        /// Sync roles, groups and users.
        /// </summary>
        /// <returns></returns>
        Task<int> SyncAsync();
    }
}
