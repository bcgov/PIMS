using System.Collections.Generic;

namespace Pims.Api.Areas.Admin.Models.User
{
    public class AccessRequestModel : Api.Models.BaseModel
    {
        #region Properties
        public int Id { get; set; }
        public bool? IsGranted { get; set; }
        public bool IsDisabled { get; set; }
        public string Note { get; set; }
        public AccessRequestUserModel User { get; set; }
        public IEnumerable<AccessRequestAgencyModel> Agencies { get; set; }
        public IEnumerable<AccessRequestRoleModel> Roles { get; set; }
        #endregion
    }
}
