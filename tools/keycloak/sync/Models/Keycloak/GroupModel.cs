using Pims.Tools.Keycloak.Sync.Configuration.Realm;
using System.Collections.Generic;
using System.Linq;

namespace Pims.Tools.Keycloak.Sync.Models.Keycloak
{
    /// <summary>
    /// GroupModel class, provides a model to represent a keycloak group.
    /// </summary>
    public class GroupModel : Core.Keycloak.Models.GroupModel
    {
        #region Properties
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a GroupModel class.
        /// </summary>
        public GroupModel() { }

        /// <summary>
        /// Creates a new instance of a GroupModel class, initializes with specified arguments.
        /// </summary>
        /// <param name="group"></param>
        public GroupModel(GroupOptions group)
        {
            this.Name = group.Name;
            this.RealmRoles = group.RealmRoles.ToArray();
            if (group.ClientRoles != null)
            {
                this.ClientRoles = new Dictionary<string, string[]>();
                foreach (var role in group.ClientRoles)
                {
                    this.ClientRoles.Add(role.ClientId, role.ClientRoles.ToArray());
                }
            }
        }
        #endregion
    }
}
