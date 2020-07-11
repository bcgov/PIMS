using System;

namespace Pims.Tools.Keycloak.Sync.Models
{
    /// <summary>
    /// ClaimModel class, provides a mdoel for claims.
    /// </summary>
    public class ClaimModel : BaseModel
    {
        #region Properties
        /// <summary>
        /// get/set - The primary unique key identifier.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// get/set - A unique name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// get/set - The unique key in keycloak that links this claim with the role.
        /// </summary>
        public Guid? KeycloakRoleId { get; set; }

        /// <summary>
        /// get/set - A description.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// get/set - Whether the claim is disabled.
        /// </summary>
        public bool IsDisabled { get; set; }
        #endregion
    }
}
