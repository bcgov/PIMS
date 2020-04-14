namespace Pims.Api.Areas.Keycloak.Models.User
{
    /// <summary>
    /// AgencyModel class, provides a model to represent the agency.
    /// </summary>
    public class AgencyModel : Api.Models.CodeModel<int>
    {
        #region Properties
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
