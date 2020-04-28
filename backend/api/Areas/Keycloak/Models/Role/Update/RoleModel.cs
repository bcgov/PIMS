namespace Pims.Api.Areas.Keycloak.Models.Role.Update
{
    /// <summary>
    /// RoleModel class, provides a model that represents a role.
    /// </summary>
    public class RoleModel : BaseModel
    {
        #region Properties
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

        /// <summary>
        /// get/set - Whether the role is public.
        /// One which users can request to join.
        /// </summary>
        public bool IsPublic { get; set; }
        #endregion
    }
}
