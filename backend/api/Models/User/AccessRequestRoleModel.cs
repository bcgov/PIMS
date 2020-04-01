using System.Collections.Generic;

namespace Pims.Api.Models.User
{
    /// <summary>
    /// AccessRequestRoleModel class, provides a model that represents a role attached to an access request.
    /// </summary>
    public class AccessRequestRoleModel : CodeModel
    {
        #region Properties
        public string Description { get; set; }
        public ICollection<UserModel> Users { get; } = new List<UserModel>();
        #endregion
    }
}
