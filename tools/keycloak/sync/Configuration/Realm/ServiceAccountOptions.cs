namespace Pims.Tools.Keycloak.Sync.Configuration.Realm
{
    /// <summary>
    /// ServiceAccountOptions class, provides a way to configure a client service account.
    /// </summary>
    public class ServiceAccountOptions
    {
        #region Properties
        /// <summary>
        /// get/set - An array of realm roles this service account has.
        /// </summary>
        public string[] RealmRoles { get; set; }

        /// <summary>
        /// get/set - An array of client roles this service account has.
        /// </summary>
        public ClientRoleOptions[] ClientRoles { get; set; }
        #endregion
    }
}
