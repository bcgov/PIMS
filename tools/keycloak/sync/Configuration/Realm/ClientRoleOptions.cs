namespace Pims.Tools.Keycloak.Sync.Configuration.Realm
{
    /// <summary>
    /// ClientRoleOptions class, provides a way to configure service account client roles.
    /// </summary>
    public class ClientRoleOptions
    {
        #region Properties
        /// <summary>
        /// get/set - The client id for the related roles.
        /// </summary>
        public string ClientId { get; set; }

        /// <summary>
        /// get/set - The client roles.
        /// </summary>
        public string[] ClientRoles { get; set; }
        #endregion
    }
}
