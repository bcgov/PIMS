using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace Pims.Api.Models
{
    public class AccessRequestModel : BaseModel
    {
        #region Properties
        public Guid Id { get; }
        public UserModel User { get; set; }
        public IEnumerable<AgencyModel> Agencies { get; set; }
        public bool? IsGranted { get; set; }
        public IEnumerable<RoleModel> Roles { get; set; }
        public bool IsDisabled { get; set; }

        public AccessRequestModel() { }

        #endregion
    }
}
