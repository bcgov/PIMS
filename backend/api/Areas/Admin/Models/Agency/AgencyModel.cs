namespace Pims.Api.Areas.Admin.Models.Agency
{
    /// <summary>
    /// AgencyModel class, provides a model that represents the agency.
    /// </summary>
    public class AgencyModel : Api.Models.CodeModel<int>
    {
        #region Properties
        /// <summary>
        /// get/set - The agency description.
        /// </summary>
        /// <value></value>
        public string Description { get; set; }

        public string Email { get; set; }

        public string SendEmail { get; set; }
        
        #endregion
    }
}
