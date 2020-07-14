using Pims.Dal.Entities;
using System.Collections.Generic;

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
