using System;
using System.Collections.Generic;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// Task class, provides an entity for the datamodel to manage a list of process tasks that represent a to-do list.
    /// </summary>
    public class Task : LookupEntity<int>
    {
        #region Properties
        /// <summary>
        /// get/set - A description of the tier.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// get/set - Whether this task is required before a process can be completed.
        /// </summary>
        public bool IsOptional { get; set; }

        /// <summary>
        /// get - A collection of statuses associated to this project task.
        /// </summary>
        public ICollection<ProjectStatusTask> Statuses { get; } = new List<ProjectStatusTask>();
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a Task class.
        /// </summary>
        public Task() { }

        /// <summary>
        /// Create a new instance of a Task class.
        /// </summary>
        /// <param name="status"></param>
        /// <param name="name"></param>
        public Task(string name)
        {
            if (String.IsNullOrWhiteSpace(name)) throw new ArgumentException("Argument is required and cannot be null, empty or whitespace.", nameof(name));
            this.Name = name;
        }
        #endregion
    }
}
