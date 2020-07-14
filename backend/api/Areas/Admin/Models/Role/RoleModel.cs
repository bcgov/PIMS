using System;
using System.Collections.Generic;

namespace Pims.Api.Areas.Admin.Models.Role
{
    /// <summary>
    /// RoleModel class, provides a model that represents a role.
    /// </summary>
    public class RoleModel : Api.Models.LookupModel<Guid>
    {
        #region Properties
        /// <summary>
        /// get/set - The role description.
        /// </summary>
        /// <value></value>
        public string Description { get; set; }

        /// <summary>
        /// get/set - Whether the role is public.
        /// One which users can request to join.
        /// </summary>
        public bool IsPublic { get; set; }

        /// <summary>
        /// get/set - The keycloak group id.
        /// </summary>
        public Guid? KeycloakGroupId { get; set; }

        /// <summary>
        /// get/set - An array of claims associated to this role.
        /// </summary>
        public IEnumerable<ClaimModel> Claims { get; set; }
        #endregion
    }
}
