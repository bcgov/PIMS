using System;
using System.Collections.Generic;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// Role class, provides an entity for the datamodel to manage roles.
    /// </summary>
    public class Role : LookupEntity
    {
        #region Properties
        /// <summary>
        /// get/set - The primary key IDENTITY.
        /// </summary>
        /// <value></value>
        public new Guid Id { get; set; }

        /// <summary>
        /// get/set - The roles first name.
        /// </summary>
        /// <value></value>
        public string Description { get; set; }

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
