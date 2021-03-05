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
        public string Description { get; set; }

        /// <summary>
        /// get/set - The agency email.
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// get/set - Whether to send email to the agency.
        /// </summary>
        public bool SendEmail { get; set; }

        /// <summary>
        /// get/set - Who the email will be addressed to.
        /// </summary>
        public string AddressTo { get; set; }
        #endregion
    }
}
