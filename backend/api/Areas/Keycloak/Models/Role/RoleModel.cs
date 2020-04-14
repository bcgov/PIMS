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
        /// get/set - The role description.
        /// </summary>
        /// <value></value>
        public string Description { get; set; }
        #endregion
    }
}
