
using Pims.Api.Areas.Project.Models.Dispose;
using System;

namespace Pims.Api.Areas.Project.Models.Report
{
    /// <summary>
    /// ProjectSnapshotModel class, provides a model to represent the project.
    /// </summary>
    public class ProjectSnapshotModel : Api.Models.BaseModel
    {
        #region Properties
        /// <summary>
        /// get/set - The primary key to identify the project.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// get/set - The project id corresponding to this snapshot.
        /// </summary>
        public int ProjectId { get; set; }

        /// <summary>
        /// get/set - The project corresponding to this snapshot.
        /// </summary>
        public ProjectModel Project { get; set; }

        /// <summary>
        /// get/set - The date when this snapshot's data was taken from the project.
        /// </summary>
        public DateTime? SnapshotOn { get; set; }

        /// <summary>
        /// get/set - The netbook value.
        /// </summary>
        public decimal NetBook { get; set; }

        /// <summary>
        /// get/set - The estimated value.
        /// </summary>
        public decimal Estimated { get; set; }

        /// <summary>
        /// get/set - The assessed value.
        /// </summary>
        public decimal Assessed { get; set; }

        /// <summary>
        /// get/set - The appraised value.
        /// </summary>
        public decimal Appraised { get; set; }

        /// <summary>
        /// get/set - The sales cost.
        /// </summary>
        public decimal? SalesCost { get; set; }

        /// <summary>
        /// get/set - The net proceeds
        /// </summary>
        public decimal? NetProceeds { get; set; }

        /// <summary>
        /// get/set - The net proceed baseline integrity
        /// </summary>
        public decimal? BaselineIntegrity { get; set; }

        /// <summary>
        /// get/set - The program cost.
        /// </summary>
        public decimal? ProgramCost { get; set; }

        /// <summary>
        /// get/set - The gain or loss from selling the properties.
        /// </summary>
        public decimal? GainLoss { get; set; }

        /// <summary>
        /// get/set - OCG final statement.
        /// </summary>
        public decimal? OcgFinancialStatement { get; set; }

        /// <summary>
        /// get/set - Record the interest component.
        /// </summary>
        public decimal? InterestComponent { get; set; }

        /// <summary>
        /// get/set - Whether the sale includes a lease in place (SLIP).
        /// </summary>
        public bool SaleWithLeaseInPlace { get; set; }
        #endregion
    }
}
