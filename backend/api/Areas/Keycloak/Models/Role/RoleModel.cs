using System;

namespace Pims.Api.Areas.Keycloak.Models.Role
{
    /// <summary>
    /// RoleModel class, provides a model that represents a role.
    /// </summary>
    public class RoleModel : Api.Models.LookupModel<Guid>
    {
        #region Properties
        /// <summary>
        /// get/set - The GUID that identifies this Group in Keycloak.
        /// </summary>
        public Guid? KeycloakGroupId { get; set; }

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
        #endregion
    }
}
