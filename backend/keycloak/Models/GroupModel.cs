using System;
using System.Collections.Generic;

namespace Pims.Keycloak.Models
{
    /// <summary>
    /// GroupModel class, provides a way to manage groups within keycloak.
    /// </summary>
    public class GroupModel
    {
        #region Properties
        /// <summary>
        /// get/set - The unique key that identifies this group.
        /// </summary>
        /// <value></value>
        public Guid Id { get; set; }

        /// <summary>
        /// get/set - The unique name for this group.
        /// </summary>
        /// <value></value>
        public string Name { get; set; }

        /// <summary>
        /// get/set - The path to the group.
        /// </summary>
        /// <value></value>
        public string Path { get; set; }

        /// <summary>
        /// get/set - A dictionary of client roles.
        /// </summary>
        /// <value></value>
        public Dictionary<string, string[]> ClientRoles { get; set; }

        /// <summary>
        /// get/set - An array of realm roles.
        /// </summary>
        /// <value></value>
        public IEnumerable<string> RealmRoles { get; set; }

        /// <summary>
        /// get/set - A dictionary of group attributes.
        /// </summary>
        /// <value></value>
        public Dictionary<string, string[]> Attributes { get; set; }

        /// <summary>
        /// get/set - An array of sub-groups.
        /// </summary>
        /// <value></value>
        public GroupModel[] SubGroups { get; set; }
        #endregion
    }
}
