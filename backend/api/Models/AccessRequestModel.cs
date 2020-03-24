using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using Pims.Api.Areas.Admin.Models;
using Pims.Api.Models.Parts;

namespace Pims.Api.Models
{
    public class AccessRequestModel : BaseModel
    {
        #region Properties
        public Guid Id { get; set; }
        public AccessRequestUserModel User { get; set; }
        public IEnumerable<AgencyModel> Agencies { get; set; }
        public bool? IsGranted { get; set; }
        public IEnumerable<AccessRequestRoleModel> Roles { get; set; }
        public bool IsDisabled { get; set; }

        public AccessRequestModel() { }

        #endregion
    }
}
