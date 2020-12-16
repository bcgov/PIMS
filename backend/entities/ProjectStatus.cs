using System;
using System.Collections.Generic;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// ProjectStatus class, provides an entity for the datamodel to manage a list project statuses.
    /// </summary>
    public class ProjectStatus : CodeEntity<int>
    {
        #region Properties
        /// <summary>
        /// get/set - A group name is used instead of the name when a group of status are related and should be presented as one.
        /// </summary>
        public string GroupName { get; set; }

        /// <summary>
        /// get/set - A description of the tier.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// get/set - Whether this status is a milestone and requires a special workflow transition to go to this status.
        /// </summary>
        public bool IsMilestone { get; set; }

        /// <summary>
        /// get/set - Whether this status represents a terminal status
        /// </summary>
        public bool IsTerminal { get; set; }

        /// <summary>
        /// get/set - The route to the component/page that represents this status.
        /// </summary>
        public string Route { get; set; }

        /// <summary>
        /// get - Collection of tasks associated to this project status.
        /// </summary>
        public ICollection<Task> Tasks { get; } = new List<Task>();

        /// <summary>
        /// get - Collection of workflows that contain this project status.
        /// </summary>
        public ICollection<WorkflowProjectStatus> Workflows { get; } = new List<WorkflowProjectStatus>();

        /// <summary>
        /// get - Collection of projects.
        /// </summary>
        public ICollection<Project> Projects { get; } = new List<Project>();
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a ProjectStatus class.
        /// </summary>
        public ProjectStatus() { }

        /// <summary>
        /// Create a new instance of a ProjectStatus class.
        /// </summary>
        /// <param name="name"></param>
        /// <param name="code"></param>
        /// <param name="isMilestone"></param>
        public ProjectStatus(string name, string code, bool isMilestone = false)
        {
            if (String.IsNullOrWhiteSpace(name)) throw new ArgumentException("Argument is required and cannot be null, empty or whitespace.", nameof(name));
            if (String.IsNullOrWhiteSpace(code)) throw new ArgumentException("Argument is required and cannot be null, empty or whitespace.", nameof(code));
            this.Name = name;
            this.Code = code;
            this.IsMilestone = isMilestone;
        }
        #endregion
    }
}
