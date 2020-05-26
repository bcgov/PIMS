using Pims.Tools.Keycloak.Sync.Configuration.Realm;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Pims.Tools.Keycloak.Sync.Models.Keycloak
{
    /// <summary>
    /// GroupModel class, provides a model to represent a keycloak group.
    /// </summary>
    public class GroupModel
    {
        #region Properties
        /// <summary>
        /// get/set - A unique primary key.
        /// </summary>
        public Guid? Id { get; set; }

        /// <summary>
        /// get/set - A unique name to identify this group.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// get/set - The full path to the group.
        /// </summary>
        public string Path { get; set; }

        /// <summary>
        /// get/set - An array of role names associated to this group.
        /// </summary>
        public string[] RealmRoles { get; set; }

        /// <summary>
        /// get/set - A dictionary of client roles.
        /// </summary>
        public Dictionary<string, string[]> ClientRoles { get; set; }

        /// <summary>
        /// get/set - An array of sub-groups.
        /// </summary>
        public string[] SubGroups { get; set; }

        /// <summary>
        /// get/set - A dictionary of attributes.
        /// </summary>
        public Dictionary<string, string[]> Attributes { get; set; }
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
            this.ClientRoles = new Dictionary<string, string[]>();
            foreach (var role in group.ClientRoles?.Where(r => true))
            {
                this.ClientRoles.Add(role.ClientId, role.ClientRoles.ToArray());
            }
        }
        #endregion
    }
}
