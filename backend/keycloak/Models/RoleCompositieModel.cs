using System.Collections.Generic;

namespace Pims.Keycloak.Models
{
    /// <summary>
    /// RoleCompositeModel class, provides a way to manage role composites within keycloak.
    /// </summary>
    public class RoleCompositeModel
    {
        #region Properties
        /// <summary>
        /// get/set - A dictionary of clients.
        /// </summary>
        /// <value></value>
        public Dictionary<string, string[]> Client { get; set; }

        /// <summary>
        /// get/set - An array of realms.
        /// </summary>
        /// <value></value>
        public IEnumerable<string> Realm { get; set; }
        #endregion
    }
}
