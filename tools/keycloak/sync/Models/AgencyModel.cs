namespace Pims.Tools.Keycloak.Sync.Models
{
    /// <summary>
    /// AgencyModel class, provides a model that represents the agency.
    /// </summary>
    public class AgencyModel : BaseModel
    {
        #region Properties
        /// <summary>
        /// get/set - The item's unique identifier.
        /// </summary>
        /// <value></value>
        public int Id { get; set; }

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
        /// get/set - The item's unique code.
        /// </summary>
        /// <value></value>
        public string Code { get; set; }

        /// <summary>
        /// get/set - The agency description.
        /// </summary>
        /// <value></value>
        public string Description { get; set; }

        /// <summary>
        /// get/set - The parent agency.
        /// </summary>
        /// <value></value>
        public int? ParentId { get; set; }
        #endregion
    }
}
