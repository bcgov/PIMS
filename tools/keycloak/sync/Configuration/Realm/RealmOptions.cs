namespace Pims.Tools.Keycloak.Sync.Configuration.Realm
{
    /// <summary>
    /// RealmOptions class, provides a way to configure the realm.
    /// </summary>
    public class RealmOptions
    {
        #region Properties
        /// <summary>
        /// get/set - The unique name of the realm.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// get/set - The display name of the realm.
        /// </summary>
        public string DisplayName { get; set; }

        /// <summary>
        /// get/set - The HTML to display with the name.
        /// </summary>
        public string DisplayNameHtml { get; set; }

        /// <summary>
        /// get/set - An array of roles in the realm.
        /// </summary>
        public RoleOptions[] Roles { get; set; }

        /// <summary>
        /// get/set - An array of groups in the realm.
        /// </summary>
        public GroupOptions[] Groups { get; set; }

        /// <summary>
        /// get/set - An array of clients in the realm.
        /// </summary>
        public ClientOptions[] Clients { get; set; }
        #endregion
    }
}
