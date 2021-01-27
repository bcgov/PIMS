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

        /// <summary>
        /// get/set - Additional serialized metadata.
        /// </summary>
        public string Metadata { get; set; }

        #region Financials
        /// <summary>
        /// get/set - The net book value.
        /// </summary>
        public decimal? NetBook { get; set; }

        /// <summary>
        /// get/set - The market value.
        /// </summary>
        public decimal? Market { get; set; }

        /// <summary>
        /// get/set - The assessed value.
        /// </summary>
        public decimal? Assessed { get; set; }

        /// <summary>
        /// get/set - The appraised value.
        /// </summary>
        public decimal? Appraised { get; set; }
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

            this.SnapshotOn = DateTime.UtcNow;
            this.Project = project;

            this.NetBook = project.NetBook;
            this.Market = project.Market;
            this.Assessed = project.Assessed;
            this.Appraised = project.Appraised;

            this.Metadata = project.Metadata;
        }
        #endregion
    }
}
