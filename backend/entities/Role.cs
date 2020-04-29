using System;
using System.Collections.Generic;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// Role class, provides an entity for the datamodel to manage roles.
    /// </summary>
    public class Role : LookupEntity<Guid>
    {
        #region Properties
        /// <summary>
        /// get/set - The GUID that identifies this Group in Keycloak.
        /// </summary>
        public Guid? KeycloakGroupId { get; set; }

        /// <summary>
        /// get/set - The roles first name.
        /// </summary>
        /// <value></value>
        public string Description { get; set; }

        /// <summary>
        /// get/set - Whether the role is a public role.
        /// One which new users can request to join.
        /// </summary>
        public bool IsPublic { get; set; } = false;

        /// <summary>
        /// get - A collection of users that have this role.
        /// </summary>
        /// <typeparam name="UserRole"></typeparam>
        /// <returns></returns>
        public ICollection<UserRole> Users { get; } = new List<UserRole>();

        /// <summary>
        /// get - A collection of claims for this role.
        /// </summary>
        /// <typeparam name="RoleClaim"></typeparam>
        /// <returns></returns>
        public ICollection<RoleClaim> Claims { get; } = new List<RoleClaim>();
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a Role class.
        /// </summary>
        public Role() { }

        /// <summary>
        /// Create a new instance of a Role class.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        public Role(Guid id, string name)
        {
            this.Id = id;
            this.Name = name;
        }
        #endregion
    }
}
