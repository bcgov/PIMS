using System.Threading.Tasks;

namespace Pims.Tools.Keycloak.Sync
{
    /// <summary>
    /// ISyncFactory interface, provides a way to sync PIMS with Keycloak.
    /// </summary>
    public interface ISyncFactory
    {
        /// <summary>
        /// Sync roles, groups and users.
        /// </summary>
        /// <returns></returns>
        Task<int> SyncAsync();
    }
}
