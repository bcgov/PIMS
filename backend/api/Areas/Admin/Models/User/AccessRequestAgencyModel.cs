namespace Pims.Api.Areas.Admin.Models.User
{
    /// <summary>
    /// AccessRequestAgencyModel class, provides a model that represents the agency.
    /// </summary>
    public class AccessRequestAgencyModel : Api.Models.CodeModel<int>
    {
        #region Properties
        /// <summary>
        /// get/set - The agency description.
        /// </summary>
        /// <value></value>
        public string Description { get; set; }
        #endregion
    }
}
