using System;
using System.Collections.Generic;

namespace Pims.Tools.Keycloak.Sync.Models
{
    public class RoleModel : BaseModel
    {
        #region Properties
        public Guid Id { get; set; }

        public string Name { get; set; }

        public Guid? KeycloakGroupId { get; set; }

        public string Description { get; set; }

        public bool IsDisabled { get; set; }

        public bool IsPublic { get; set; }

        public int SortOrder { get; set; }

        public ICollection<ClaimModel> Claims { get; set; } = new List<ClaimModel>();
        #endregion
    }
}
