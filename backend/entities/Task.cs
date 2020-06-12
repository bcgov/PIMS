using System;

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
        /// get/set - Foreign key to the project status.
        /// </summary>
        public int? StatusId { get; set; }

        /// <summary>
        /// get/set - The project status this task is associated with.
        /// </summary>
        public ProjectStatus Status { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a Task class.
        /// </summary>
        public Task() { }

        /// <summary>
        /// Create a new instance of a Task class, initializes with specified arguments.
        /// </summary>
        /// <param name="name"></param>
        /// <param name="isOptional"></param>
        public Task(string name, bool isOptional = true)
        {
            if (String.IsNullOrWhiteSpace(name)) throw new ArgumentException("Argument is required and cannot be null, empty or whitespace.", nameof(name));
            this.Name = name;
            this.IsOptional = isOptional;
        }

        /// <summary>
        /// Create a new instance of a Task class, initializes with specified arguments.
        /// </summary>
        /// <param name="name"></param>
        /// <param name="status"></param>
        /// <param name="isOptional"></param>
        public Task(string name, ProjectStatus status, bool isOptional = true) : this(name, isOptional)
        {
            this.StatusId = status?.Id;
            this.Status = status;
        }
        #endregion
    }
}
