namespace Pims.Tools.Keycloak.Sync.Configuration.Realm
{
    /// <summary>
    /// ClientOptions class, provides a way to configure a realm role.
    /// </summary>
    public class RoleOptions
    {
        #region Properties
        /// <summary>
        /// get/set - The name of the role.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// get/set - The role description.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// get/set - Whether this is a composite role.
        /// </summary>
        public bool Composite { get; set; } = false;

        /// <summary>
        /// get/set - Whether this is a client role.
        /// </summary>
        public bool ClientRole { get; set; } = false;

        /// <summary>
        /// get/set - An array of composite roles this role inherits.
        /// </summary>
        public string[] RealmRoles { get; set; }
        #endregion
    }
}
