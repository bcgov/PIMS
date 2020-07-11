using System;
using System.Collections.Generic;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// ProjectRisk class, provides an entity for the datamodel to manage project risks.
    /// </summary>
    public class ProjectRisk : CodeEntity<int>
    {
        #region Properties
        /// <summary>
        /// get/set - A description of the risk.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// get - A collection of notes for this project.
        /// </summary>
        public ICollection<Project> Projects { get; } = new List<Project>();
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a ProjectRisk class.
        /// </summary>
        public ProjectRisk() { }

        /// <summary>
        /// Create a new instance of a ProjectRisk class, initializes with specified arguments.
        /// </summary>
        /// <param name="name"></param>
        /// <param name="code"></param>
        /// <param name="sortOrder"></param>
        public ProjectRisk(string name, string code, int sortOrder)
        {
            if (String.IsNullOrWhiteSpace(name)) throw new ArgumentException("Argument cannot be null, empty or whitespace.", nameof(name));
            if (String.IsNullOrWhiteSpace(code)) throw new ArgumentException("Argument cannot be null, empty or whitespace.", nameof(code));

            this.Name = name;
            this.Code = code;
            this.SortOrder = sortOrder;
        }
        #endregion
    }
}
