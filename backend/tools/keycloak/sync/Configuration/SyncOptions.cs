using Pims.Tools.Keycloak.Sync.Configuration.Realm;

namespace Pims.Tools.Keycloak.Sync.Configuration
{
    /// <summary>
    /// SyncOptions class, provides a way to configure the sync controls.
    /// </summary>
    public class SyncOptions
    {
        #region Properties
        /// <summary>
        /// get/set - Whether to retry a request after a failure.
        /// </summary>
        /// <value></value>
        public bool RetryAfterFailure { get; set; } = true;

        /// <summary>
        /// get/set - How many retries after a failure should be sent.
        /// </summary>
        /// <value></value>
        public int RetryAttempts { get; set; } = 3;

        /// <summary>
        /// get/set - After how many failures should the import be aborted.
        /// </summary>
        /// <value></value>
        public int AbortAfterFailure { get; set; } = 1;

        /// <summary>
        /// get/set - Configuration of the realm.
        /// </summary>
        public RealmOptions Realm { get; set; }
        #endregion
    }
}
