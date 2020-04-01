namespace Pims.Api.Areas.Admin.Models.User
{
    /// <summary>
    /// AgencyModel class, provides a model that represents the agency.
    /// </summary>
    public class AgencyModel : Pims.Api.Models.BaseModel
    {
        #region Properties
        /// <summary>
        /// get/set - The unique identity of the agency.
        /// </summary>
        /// <value></value>
        public int Id { get; set; }

        /// <summary>
        /// get/set - The unique name of the agency.
        /// </summary>
        /// <value></value>
        public string Name { get; set; }

        /// <summary>
        /// get/set - The unique code to identify the agency.
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
