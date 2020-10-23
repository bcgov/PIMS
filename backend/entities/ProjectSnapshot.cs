using System;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// ProjectSnapshot class, provides an entity for the datamodel to manage project snapshots which are used for reporting.
    /// </summary>
    public class ProjectSnapshot : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - The primary key provides a unique identity for the project snapshot.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// get/set - The foreign key to the owning project.
        /// </summary>
        public int ProjectId { get; set; }

        /// <summary>
        /// get/set - The project this snapshot is from.
        /// </summary>
        public Project Project { get; set; }

        /// <summary>
        /// get/set - The date that this snapshot was taken.
        /// </summary>
        public DateTime SnapshotOn { get; set; }

        #region Financials
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
        public decimal? SalesCost { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - The net proceeds
        /// </summary>
        public decimal? NetProceeds { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - The net proceed baseline integrity
        /// </summary>
        public decimal? BaselineIntegrity { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - The program cost.
        /// </summary>
        public decimal? ProgramCost { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - The gain or loss from selling the properties.
        /// </summary>
        public decimal? GainLoss { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - OCG final statement.
        /// </summary>
        public decimal? OcgFinancialStatement { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - Record the interest component.
        /// </summary>
        public decimal? InterestComponent { get; set; } // TODO: Move to metadata property.

        /// <summary>
        /// get/set - Whether the sale includes a lease in place (SLIP).
        /// </summary>
        public bool SaleWithLeaseInPlace { get; set; } // TODO: Move to metadata property.
        #endregion
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a ProjectSnapshot class.
        /// </summary>
        public ProjectSnapshot() { }

        /// <summary>
        /// Create a new instance of a ProjectSnapshot class, initializes with specified arguments
        /// </summary>
        /// <param name="project"></param>
        public ProjectSnapshot(Project project)
        {
            this.ProjectId = project?.Id ?? throw new ArgumentNullException(nameof(project));
            this.Project = project;
            this.NetBook = project.NetBook;
            this.Estimated = project.Estimated;
            this.Assessed = project.Assessed;
            this.SalesCost = project.SalesCost;
            this.NetProceeds = project.NetProceeds;
            this.ProgramCost = project.ProgramCost;
            this.GainLoss = project.GainLoss;
            this.OcgFinancialStatement = project.OcgFinancialStatement;
            this.InterestComponent = project.InterestComponent;
            this.SaleWithLeaseInPlace = project.SaleWithLeaseInPlace;
        }
        #endregion
    }
}
