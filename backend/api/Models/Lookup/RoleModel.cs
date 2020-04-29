using System;

namespace Pims.Api.Models.Lookup
{
    public class RoleModel : LookupModel<Guid>
    {
        #region Properties
        public string Description { get; set; }
        public bool IsPublic { get; set; }
        #endregion
    }
}
