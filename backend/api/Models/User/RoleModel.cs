using System.Collections.Generic;

namespace Pims.Api.Models.User
{
    public class RoleModel : CodeModel
    {
        #region Properties
        public string Description { get; set; }
        public ICollection<UserModel> Users { get; } = new List<UserModel>();
        #endregion
    }
}
