using System;
using System.Collections.Generic;

namespace Pims.Api.Models.User
{
    public class RoleModel : LookupModel<Guid>
    {
        #region Properties
        public string Description { get; set; }
        public ICollection<UserModel> Users { get; } = new List<UserModel>();
        #endregion
    }
}
