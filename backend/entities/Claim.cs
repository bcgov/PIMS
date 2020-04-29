using System;
using System.Collections.Generic;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// Claim class, provides an entity for the datamodel to manage claims.
    /// </summary>
    public class Claim : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - The primary key IDENTITY.
        /// </summary>
        /// <value></value>
        public Guid Id { get; set; }

        /// <summary>
        /// get/set - The claims display name.
        /// </summary>
        /// <value></value>
        public string Name { get; set; }

        /// <summary>
        /// get/set - The GUID that identifies this Role in Keycloak.
        /// </summary>
        public Guid? KeycloakRoleId { get; set; }

        /// <summary>
        /// get/set - The claims first name.
        /// </summary>
        /// <value></value>
        public string Description { get; set; }

        /// <summary>
        /// get/set - Whether the user is disabled.
        /// </summary>
        /// <value></value>
        public bool IsDisabled { get; set; }

        /// <summary>
        /// get - A collection of roles that have this claim.
        /// </summary>
        /// <typeparam name="RoleClaim"></typeparam>
        /// <returns></returns>
        public ICollection<RoleClaim> Roles { get; } = new List<RoleClaim>();
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a Claim class.
        /// </summary>
        public Claim() { }

        /// <summary>
        /// Create a new instance of a Claim class.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        public Claim(Guid id, string name)
        {
            this.Id = id;
            this.Name = name;
        }
        #endregion
    }
}
