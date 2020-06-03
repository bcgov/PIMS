using System;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// ProjectStatusTransition class, provides a way to manage valid project status transitions.
    /// </summary>
    public class ProjectStatusTransition : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - Primary key and foreign key to the project status.
        /// </summary>
        public int StatusId { get; set; }

        /// <summary>
        /// get/set - The owning project status.
        /// </summary>
        public ProjectStatus Status { get; set; }

        /// <summary>
        /// get/set - Primary key and foreign key to the valid project status this transition allows.
        /// </summary>
        public int ToStatusId { get; set; }

        /// <summary>
        /// get/set - The project status this transition allows.
        /// </summary>
        public ProjectStatus ToStatus { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a ProjectStatusTransition class.
        /// </summary>
        public ProjectStatusTransition() { }

        /// <summary>
        /// Create a new instance of a ProjectStatusTransition class, initiailizes with specified arguments.
        /// </summary>
        /// <param name="status"></param>
        /// <param name="toStatus"></param>
        public ProjectStatusTransition(ProjectStatus status, ProjectStatus toStatus)
        {
            this.Status = status;
            this.StatusId = status?.Id ?? throw new ArgumentNullException(nameof(status));
            this.ToStatus = toStatus;
            this.ToStatusId = toStatus?.Id ?? throw new ArgumentNullException(nameof(toStatus));
        }
        #endregion
    }
}
