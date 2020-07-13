using Pims.Dal.Entities;
using System;

namespace Pims.Api.Areas.Tools.Models.Import
{
    /// <summary>
    /// ProjectAgencyResponseModel class, provides a model to represent a project agency response.
    /// </summary>
    public class ProjectAgencyResponseModel : Pims.Api.Models.BaseModel
    {
        #region Properties
        /// <summary>
        /// get/set - The foreign key to the agency.
        /// </summary>
        public int AgencyId { get; set; }

        /// <summary>
        /// get/set - The agency code.
        /// </summary>
        public string AgencyCode { get; set; }

        /// <summary>
        /// get/set - When the response was received.
        /// </summary>
        public DateTime ReceivedOn { get; set; }

        /// <summary>
        /// get/set - The response.
        /// </summary>
        public NotificationResponses Response { get; set; }
        #endregion
    }
}
