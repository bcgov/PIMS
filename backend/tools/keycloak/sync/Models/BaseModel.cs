using System;

namespace Pims.Tools.Keycloak.Sync.Models
{
    /// <summary>
    /// BaseModel abstract class, provides the standard tracking properties for models.
    /// </summary>
    public abstract class BaseModel
    {
        #region Properties
        /// <summary>
        /// get/set - When the item was created.
        /// </summary>
        public DateTime CreatedOn { get; set; }

        /// <summary>
        /// get/set - When the item was updated.
        /// </summary>
        public DateTime? UpdatedOn { get; set; }

        /// <summary>
        /// get/set - The rowvesion.
        /// </summary>
        public string RowVersion { get; set; }
        #endregion
    }
}
