using Pims.Tools.Keycloak.Sync.Configuration.Realm;
using System;
using System.Collections.Generic;

namespace Pims.Tools.Keycloak.Sync.Models.Keycloak
{
    /// <summary>
    /// RoleModel class, provides a model to represent a keycloak role.
    /// </summary>
    public class RoleModel
    {
        #region Properties
        /// <summary>
        /// get/set - A primary key for the role.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// get/set - A unique name to identify the role.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// get/set - A description.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// get/set - Whether this is a composite role.
        /// </summary>
        public bool Composite { get; set; }

        /// <summary>
        /// get/set - Whether this is a client role.
        /// </summary>
        public bool ClientRole { get; set; }

        /// <summary>
        /// get/set - The container this role belongs in.
        /// </summary>
        public string ContainerId { get; set; }

        /// <summary>
        /// get/set - A dictionary of attributes.
        /// </summary>
        public Dictionary<string, string[]> Attributes { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a RoleModel class.
        /// </summary>
        public RoleModel() { }

        /// <summary>
        /// Creates a new instance of a RoleModel class, initializes with specified arguments.
        /// </summary>
        /// <param name="role"></param>
        public RoleModel(RoleOptions role)
        {
            this.Name = role.Name;
            this.Description = role.Description;
            this.Composite = role.Composite;
            this.ClientRole = role.ClientRole;
        }
        #endregion
    }
}
