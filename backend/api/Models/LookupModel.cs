namespace Pims.Api.Models
{
    /// <summary>
    /// LookupModel class, provides a model that represents a code lookup item.
    /// </summary>
    /// <typeparam name="TKey"></typeparam>
    public class LookupModel<TKey> : BaseModel
    {
        #region Properties
        /// <summary>
        /// get/set - The item's unique identifier.
        /// </summary>
        /// <value></value>
        public TKey Id { get; set; }

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
        /// get/set - Whether this item is visible.
        /// </summary>
        public bool? IsVisible { get; set; }

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
