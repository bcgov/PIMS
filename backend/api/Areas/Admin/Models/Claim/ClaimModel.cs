using System;

namespace Pims.Api.Areas.Admin.Models.Claim
{
    public class ClaimModel : Api.Models.BaseModel
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
        #endregion
    }
}
