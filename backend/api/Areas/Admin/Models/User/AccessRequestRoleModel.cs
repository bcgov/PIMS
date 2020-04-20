using System;

namespace Pims.Api.Areas.Admin.Models.User
{
    /// <summary>
    /// AccessRequestRoleModel class, provides a model that represents a role attached to an access request.
    /// </summary>
    public class AccessRequestRoleModel : Api.Models.LookupModel<Guid>
    {
        #region Properties
        public string Description { get; set; }
        #endregion
    }
}
