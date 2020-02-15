using System;
using System.Collections.Generic;

namespace Pims.Dal.Data.Entities
{
    /// <summary>
    /// Role class, provides an entity for the datamodel to manage roles.
    /// </summary>
    public class Role : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - The primary key IDENTITY.
        /// </summary>
        /// <value></value>
        public Guid Id { get; set; }

        /// <summary>
        /// get/set - The roles display name.
        /// </summary>
        /// <value></value>
        public string Name { get; set; }

        /// <summary>
        /// get/set - The roles first name.
        /// </summary>
        /// <value></value>
        public string Description { get; set; }

        /// <summary>
        /// get/set - Whether the user is disabled.
        /// </summary>
        /// <value></value>
        public bool IsDisabled { get; set; }

        /// <summary>
        /// get - A collection of users that have this role.
        /// </summary>
        /// <typeparam name="UserRole"></typeparam>
        /// <returns></returns>
        public ICollection<UserRole> Users { get; } = new List<UserRole>();
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
