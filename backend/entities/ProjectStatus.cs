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

        /// <summary>
        /// get/set - The route to the component/page that represents this status.
        /// </summary>
        public string Route { get; set; }

        /// <summary>
        /// get/set - A way to identify related workflow statuses.
        /// </summary>
        public string Workflow { get; set; }
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
