using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace Pims.Api.Areas.Admin.Models.User
{
    public class AccessRequestModel : Pims.Api.Models.BaseModel
    {
        #region Properties
        public Guid Id { get; set; }
        public bool? IsGranted { get; set; }
        public bool IsDisabled { get; set; }
        public AccessRequestUserModel User { get; set; }
        public IEnumerable<AgencyModel> Agencies { get; set; }
        public IEnumerable<AccessRequestRoleModel> Roles { get; set; }
        #endregion
    }
}
