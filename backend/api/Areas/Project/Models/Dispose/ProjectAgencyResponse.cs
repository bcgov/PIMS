using System;
using Pims.Dal.Entities;

namespace Pims.Api.Areas.Project.Models.Dispose
{
    /// <summary>
    /// ProjectTaskModel class, provides a model to represent a project task.
    /// </summary>
    public class ProjectAgencyResponse : Api.Models.BaseModel
    {
        #region Properties
        /// <summary>
        /// get/set - The foreign key to the project.
        /// </summary>
        public int ProjectId { get; set; }

        /// <summary>
        /// get/set - The foreign key to the task.
        /// </summary>
        public int AgencyId { get; set; }

        /// <summary>
        /// get/set - The corresponding agency code.
        /// </summary>
        public string AgencyCode { get; set; }

        /// <summary>
        /// get/set - The foreign key of the associated notification, or null.
        /// </summary>
        public int? NotificationId { get; set; }

        /// <summary>
        /// get/set - The response from this agency.
        /// </summary>
        public NotificationResponses Response { get; set; }

        /// <summary>
        /// get/set - The date SRES received a business case from this agency.
        /// </summary>
        public DateTime? ReceivedOn { get; set; }

        /// <summary>
        /// get/set - An agency specific note viewable/editable by SRES only.
        /// </summary>
        public string Note { get; set; }

        /// <summary>
        /// get/set - amount offered by an agency for the project.
        /// </summary>
        public decimal OfferAmount { get; set; }
        #endregion
    }
}
