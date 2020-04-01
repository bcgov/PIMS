using System.Collections.Generic;

namespace Pims.Api.Areas.Admin.Models.User
{
    /// <summary>
    /// AccessRequestRoleModel class, provides a model that represents a role attached to an access request.
    /// </summary>
    public class AccessRequestRoleModel : Pims.Api.Models.CodeModel
    {
        #region Properties
        public string Description { get; set; }
        public ICollection<UserModel> Users { get; } = new List<UserModel>();
        #endregion
    }
}
