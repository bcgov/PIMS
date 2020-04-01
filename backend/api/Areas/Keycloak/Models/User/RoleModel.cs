namespace Pims.Api.Areas.Keycloak.Models.User
{
    /// <summary>
    /// RoleModel class, provides a model that represents a role.
    /// </summary>
    public class RoleModel : Pims.Api.Models.CodeModel
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
