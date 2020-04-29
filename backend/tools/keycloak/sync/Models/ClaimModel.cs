using System;

namespace Pims.Tools.Keycloak.Sync.Models
{

    public class ClaimModel : BaseModel
    {
        #region Properties
        public Guid Id { get; set; }

        public string Name { get; set; }

        public Guid? KeycloakRoleId { get; set; }

        public string Description { get; set; }

        public bool IsDisabled { get; set; }
        #endregion
    }
}
