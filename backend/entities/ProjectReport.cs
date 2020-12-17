using System;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// ProjectReport class, provides an entity for the datamodel to manage project reports.
    /// </summary>
    public class ProjectReport : BaseEntity
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

        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ProejctReport.
        /// </summary>
        public ProjectReport() { }

        /// <summary>
        /// Creates a new instance of a ProjectReport, initializes with specified arguments.
        /// </summary>
        /// <param name="type"></param>
        /// <param name="from"></param>
        /// <param name="to"></param>
        public ProjectReport(ReportTypes type, DateTime? from, DateTime? to)
        {
            this.ReportType = type;
            this.From = from;
            this.To = to;
        }

        /// <summary>
        /// Creates a new instance of a ProjectReport, initializes with specified argumentss
        /// </summary>
        /// <param name="type"></param>
        /// <param name="name"></param>
        /// <param name="from"></param>
        /// <param name="to"></param>
        public ProjectReport(ReportTypes type, string name, DateTime? from, DateTime? to) : this(type, from, to)
        {
            this.Name = name;
        }
        #endregion
    }
}
