using System;
using System.Collections.Generic;

namespace Pims.Api.Areas.Keycloak.Models.User
{
    public class AccessRequestModel : Pims.Api.Models.BaseModel
    {
        #region Properties
        public Guid Id { get; set; }
        public AccessRequestUserModel User { get; set; }
        public IEnumerable<AgencyModel> Agencies { get; set; }
        public bool? IsGranted { get; set; }
        public IEnumerable<AccessRequestRoleModel> Roles { get; set; }
        public bool IsDisabled { get; set; }
        #endregion
    }
}
