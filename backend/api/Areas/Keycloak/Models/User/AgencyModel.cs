namespace Pims.Api.Areas.Keycloak.Models.User
{
    /// <summary>
    /// AgencyModel class, provides a model to represent the agency.
    /// </summary>
    public class AgencyModel : Pims.Api.Models.BaseModel
    {
        #region Properties
        /// <summary>
        /// get/set - An unique identify for the agency.
        /// </summary>
        /// <value></value>
        public int Id { get; set; }

        /// <summary>
        /// get/set - A unique name to identify the agency.
        /// </summary>
        /// <value></value>
        public string Name { get; set; }

        /// <summary>
        /// get/set - A unique code to identify the agency.
        /// </summary>
        /// <value></value>
        public string Code { get; set; }

        /// <summary>
        /// get/set - The agency description.
        /// </summary>
        /// <value></value>
        public string Description { get; set; }

        /// <summary>
        /// get/set - The id of the owning agency.
        /// </summary>
        /// <value></value>
        public int? ParentId { get; set; }
        #endregion
    }
}
