using Pims.Dal.Entities;
using System;
using System.Collections.Generic;

namespace Pims.Api.Models.User
{
    public class AccessRequestModel : BaseModel
    {
        #region Properties
        public int Id { get; set; }
        public Guid UserId { get; set; }
        public AccessRequestUserModel User { get; set; }
        public IEnumerable<AccessRequestAgencyModel> Agencies { get; set; }
        public AccessRequestStatus Status { get; set; }
        public IEnumerable<AccessRequestRoleModel> Roles { get; set; }
        public string Note { get; set; }
        #endregion
    }
}
