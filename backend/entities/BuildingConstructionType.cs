namespace Pims.Dal.Entities
{
    /// <summary>
    /// BuildingConstructionType class, provides an entity for the datamodel to manage a list of building contruction types.
    /// </summary>
    public class BuildingConstructionType : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - The primary key IDENTITY SEED.
        /// </summary>
        /// <value></value>
        public int Id { get; set; }

        /// <summary>
        /// get/set - The unique name of this building type construction.
        /// </summary>
        /// <value></value>
        public string Name { get; set; }

        /// <summary>
        /// get/set - Whether this row is disabled.
        /// </summary>
        /// <value></value>
        public bool IsDisabled { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a BuildingConstructionType class.
        /// </summary>
        public BuildingConstructionType() { }

        /// <summary>
        /// Create a new instance of a BuildingConstructionType class.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        public BuildingConstructionType(int id, string name)
        {
            this.Id = id;
            this.Name = name;
        }
        #endregion
    }
}
