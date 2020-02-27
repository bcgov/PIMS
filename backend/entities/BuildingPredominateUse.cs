namespace Pims.Dal.Entities
{
    /// <summary>
    /// BuildingPredominateUse class, provides an entity for the datamodel to manage a list of building predominate uses.
    /// </summary>
    public class BuildingPredominateUse : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - The primary key IDENTITY SEED.
        /// </summary>
        /// <value></value>
        public int Id { get; set; }

        /// <summary>
        /// get/set - The unique name of this building predominate use.
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
        /// Create a new instance of a BuildingPredominateUse class.
        /// </summary>
        public BuildingPredominateUse() { }

        /// <summary>
        /// Create a new instance of a BuildingPredominateUse class.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        public BuildingPredominateUse(int id, string name)
        {
            this.Id = id;
            this.Name = name;
        }
        #endregion
    }
}
