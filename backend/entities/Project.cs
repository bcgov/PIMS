using System;
using System.Collections.Generic;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// Project class, provides an entity for the datamodel to manage projects.
    /// </summary>
    public class Project : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - The primary key provides a unique identity for the project.
        /// </summary>
        public string ProjectNumber { get; set; }

        /// <summary>
        /// get/set - A display name to identify the project.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// get/set - The foreign key to the owning agency.
        /// </summary>
        public int AgencyId { get; set;  }

        /// <summary>
        /// get/set - The owning agency.
        /// </summary>
        public Agency Agency { get; set; }

        /// <summary>
        /// get/set - The foreign key to the project status.
        /// </summary>
        public int StatusId { get; set; }

        /// <summary>
        /// get/set - The project status.
        /// </summary>
        public ProjectStatus Status { get; set; }

        /// <summary>
        /// get/set - A description of the project.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// get/set - A simple way to capture notes for the project.
        /// </summary>
        public string Note { get; set; }

        /// <summary>
        /// get/set - The foreign key to the tier level.
        /// </summary>
        public int TierLevelId { get; set; }

        /// <summary>
        /// get/set - The tier level.
        /// </summary>
        public TierLevel TierLevel { get; set; }

        /// <summary>
        /// get - A collection of properties associated to this project.
        /// </summary>
        public ICollection<ProjectProperty> Properties { get; } = new List<ProjectProperty>();

        /// <summary>
        /// get - A collection of tasks associated to this project.
        /// </summary>
        public ICollection<ProjectTask> Tasks { get; } = new List<ProjectTask>();
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a Project class.
        /// </summary>
        public Project() { }

        /// <summary>
        /// Create a new instance of a Project class.
        /// </summary>
        /// <param name="projectNumber"></param>
        /// <param name="name"></param>
        /// <param name="tierLevel"></param>
        public Project(string projectNumber, string name, TierLevel tierLevel)
        {
            if (String.IsNullOrWhiteSpace(projectNumber)) throw new ArgumentException("Argument cannot be null, empty or whitespace.", nameof(projectNumber));
            if (String.IsNullOrWhiteSpace(name)) throw new ArgumentException("Argument cannot be null, empty or whitespace.", nameof(name));

            this.ProjectNumber = projectNumber;
            this.Name = name;
            this.TierLevelId = tierLevel?.Id ?? throw new ArgumentNullException(nameof(tierLevel));
            this.TierLevel = tierLevel;
        }
        #endregion
    }
}
