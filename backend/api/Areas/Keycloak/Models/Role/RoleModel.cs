using System;

namespace Pims.Api.Areas.Keycloak.Models.Role
{
    /// <summary>
    /// RoleModel class, provides a model that represents a role.
    /// </summary>
    public class RoleModel : Pims.Api.Models.BaseModel
    {
        #region Properties
        /// <summary>
        /// get/set - A unique identify for the role.
        /// </summary>
        /// <value></value>
        public Guid Id { get; set; }

        /// <summary>
        /// get/set - A unique name to identify the role.
        /// </summary>
        /// <value></value>
        public string Name { get; set; }

        /// <summary>
        /// get/set - The role description.
        /// </summary>
        /// <value></value>
        public string Description { get; set; }
        #endregion
    }
}
