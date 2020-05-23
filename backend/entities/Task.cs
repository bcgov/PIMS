namespace Pims.Dal.Entities
{
    /// <summary>
    /// Task class, provides an entity for the datamodel to manage a list of process tasks that represent a to-do list.
    /// </summary>
    public class Task : LookupEntity<int>
    {
        #region Properties
        /// <summary>
        /// get/set - The task type this task belongs to - shared PRIMARY KEY
        /// </summary>
        public TaskTypes TaskType { get; set; }

        /// <summary>
        /// get/set - A description of the task.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// get/set - Whether this task is required before a process can be completed.
        /// </summary>
        public bool IsOptional { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a Task class.
        /// </summary>
        public Task() { }

        /// <summary>
        /// Create a new instance of a Task class.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        public Task(int id, string name) : base(id, name)
        {
        }
        #endregion
    }
}
