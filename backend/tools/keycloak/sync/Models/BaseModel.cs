using System;
using System.Collections.Generic;
using System.Text;

namespace Pims.Tools.Keycloak.Sync.Models
{
    public abstract class BaseModel
    {
        #region Properties
        public DateTime CreatedOn { get; set; }

        public DateTime? UpdatedOn { get; set; }

        public string RowVersion { get; set; }
        #endregion
    }
}
