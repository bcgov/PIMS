using Pims.Dal.Entities;
using System;
using System.Collections.Generic;

namespace Pims.Api.Areas.Project.Models.Report
{
    /// <summary>
    /// ProjectReportModel class, provides a model to represent the project reports.
    /// </summary>
    public class ProjectReportModel : Api.Models.BaseModel
    {
        #region Properties
        /// <summary>
        /// get/set - The primary key provides a unique identity for the project report.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// get/set - Whether this report is final and should not be deleted.
        /// </summary>
        public bool IsFinal { get; set; }

        /// <summary>
        /// get/set - An optional, descriptive name given to the report.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// get/set - The oldest date of comparison snapshots used in the report.
        /// </summary>
        public DateTime? From { get; set; }

        /// <summary>
        /// get/set - The most recent date of comparison snapshots used in the report.
        /// </summary>
        public DateTime? To { get; set; }

        /// <summary>
        /// get/set - The type of this report.
        /// </summary>
        public ReportTypes ReportType { get; set; }

        /// <summary>
        /// get/set - An array of snapshots for the project.
        /// </summary>
        public IEnumerable<ProjectSnapshotModel> Snapshots { get; set; } = new List<ProjectSnapshotModel>();
        #endregion
    }
}
