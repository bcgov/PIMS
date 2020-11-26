using System;
using System.Collections.Generic;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// Workflow class, provides a way to manage workflows within the solution.
    /// </summary>
    public class Workflow : CodeEntity<int>
    {
        #region Properties
        /// <summary>
        /// get/set - A description of 
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// get - Collection of project status that belong to this workflow.
        /// </summary>
        public ICollection<WorkflowProjectStatus> Status { get; } = new List<WorkflowProjectStatus>();

        /// <summary>
        /// get - Collection of projects currently in this workflow.
        /// </summary>
        public ICollection<Project> Projects { get; } = new List<Project>();
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a Workflow object.
        /// </summary>
        public Workflow() { }

        /// <summary>
        /// Creates a new instance of a Workflow object, initializes it with specified arguments.
        /// </summary>
        /// <param name="name"></param>
        /// <param name="code"></param>
        public Workflow(string name, string code)
        {
            if (String.IsNullOrWhiteSpace(name)) throw new ArgumentException("Argument cannot be null, empty or whitespace.", nameof(name));
            if (String.IsNullOrWhiteSpace(code)) throw new ArgumentException("Argument cannot be null, empty or whitespace.", nameof(code));
            this.Name = name;
            this.Code = code;
        }
        #endregion
    }
}
