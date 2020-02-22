using System;
using Pims.Api.Models;

namespace Pims.Api.Areas.Admin.Models
{
    public class RoleModel : BaseModel
    {
        #region Properties
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public bool IsDisabled { get; set; }
        #endregion
    }
}
