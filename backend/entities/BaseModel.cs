using System;

namespace Pims.Dal.Models
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
