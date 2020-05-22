using System.Collections.Generic;

namespace Pims.Tools.Keycloak.Sync.Configuration.Realm
{
    /// <summary>
    /// ClientOptions class, provides a way to configure a realm group.
    /// </summary>
    public class GroupOptions
    {
        #region Properties
        /// <summary>
        /// get/set - The name of the gruop.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// get/set - An array of realm roles associated to this group.
        /// </summary>
        public string[] RealmRoles { get; set; }

        /// <summary>
        /// get/set - An array of client roles associated to this group.
        /// </summary>
        public ClientRoleOptions[] ClientRoles { get; set; }
        #endregion
    }
}
