using System;
using System.Collections.Generic;

namespace Pims.Tools.Keycloak.Sync.Models
{
    /// <summary>
    /// RoleModel class, provides a model for roles.
    /// </summary>
    public class RoleModel : BaseModel
    {
        #region Properties
        /// <summary>
        /// get/set - The unique primary key for the role.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// get/set - A unique name to identify the role.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// get/set - The keycloak unique id that links this role to the group.
        /// </summary>
        public Guid? KeycloakGroupId { get; set; }

        /// <summary>
        /// get/set - A description.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// get/set - Whether this role is disabled.
        /// </summary>
        public bool IsDisabled { get; set; }

        /// <summary>
        /// get/set - Whether this role is public.
        /// </summary>
        public bool IsPublic { get; set; }

        /// <summary>
        /// get/set - sorting order.
        /// </summary>
        public int SortOrder { get; set; }

        /// <summary>
        /// get/set - An array of claims associated to this role.
        /// </summary>
        public ICollection<ClaimModel> Claims { get; set; } = new List<ClaimModel>();
        #endregion
    }
}
