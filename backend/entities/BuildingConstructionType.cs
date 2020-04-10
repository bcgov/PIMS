namespace Pims.Dal.Entities
{
    /// <summary>
    /// BuildingConstructionType class, provides an entity for the datamodel to manage a list of building contruction types.
    /// </summary>
    public class BuildingConstructionType : LookupEntity<int>
    {
        #region Properties
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
        public BuildingConstructionType(int id, string name) : base(id, name)
        {
        }
        #endregion
    }
}
