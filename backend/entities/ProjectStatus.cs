namespace Pims.Dal.Entities
{
    /// <summary>
    /// ProjectStatus class, provides an entity for the datamodel to manage a list project statuses.
    /// </summary>
    public class ProjectStatus : LookupEntity<int>
    {
        #region Properties
        /// <summary>
        /// get/set - A description of the tier.
        /// </summary>
        public string Description { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a ProjectStatus class.
        /// </summary>
        public ProjectStatus() { }

        /// <summary>
        /// Create a new instance of a ProjectStatus class.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        public ProjectStatus(int id, string name) : base(id, name)
        {
        }
        #endregion
    }
}
