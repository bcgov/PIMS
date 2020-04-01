using System;

namespace Pims.Api.Areas.Keycloak.Models.User.Update
{
    /// <summary>
    /// UserRoleModel class, provides a model that represents a user role model.
    /// </summary>
    public class UserRoleModel
    {
        #region Properties
        /// <summary>
        /// get/set - The unique identify for the user role.
        /// </summary>
        /// <value></value>
        public Guid Id { get; set; }

        /// <summary>
        /// get/set - A unique name that identifies the user role.
        /// </summary>
        /// <value></value>
        public string Name { get; set; }
        #endregion
    }
}
