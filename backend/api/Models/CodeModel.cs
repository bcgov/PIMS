namespace Pims.Api.Models
{
    /// <summary>
    /// CodeModel class, provides a model that represents a code lookup item.
    /// </summary>
    public class CodeModel : BaseModel
    {
        #region Properties
        /// <summary>
        /// get/set - The item's unique identifier.
        /// </summary>
        /// <value></value>
        public string Id { get; set; }

        /// <summary>
        /// get/set - The item's unique code.
        /// </summary>
        /// <value></value>
        public string Code { get; set; }

        /// <summary>
        /// get/set - The item's name.
        /// </summary>
        /// <value></value>
        public string Name { get; set; }

        /// <summary>
        /// get/set - Whether the item is disabled.
        /// </summary>
        /// <value></value>
        public bool IsDisabled { get; set; }

        /// <summary>
        /// get/set - The item's sort order.
        /// </summary>
        /// <value></value>
        public int SortOrder { get; set; }

        /// <summary>
        /// get/set - The item's type.
        /// </summary>
        /// <value></value>
        public string Type { get; set; }
        #endregion
    }
}
