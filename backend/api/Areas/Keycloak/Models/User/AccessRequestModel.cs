using System;
using System.Collections.Generic;
using Pims.Dal.Entities;

namespace Pims.Api.Areas.Keycloak.Models.User
{
    public class AccessRequestModel : Api.Models.BaseModel
    {
        #region Properties
        public int Id { get; set; }
        public AccessRequestStatus? Status { get; set; }
        public string Note { get; set; }
        public AccessRequestUserModel User { get; set; }
        public IEnumerable<AccessRequestAgencyModel> Agencies { get; set; }
        public IEnumerable<AccessRequestRoleModel> Roles { get; set; }
        #endregion
    }
}
