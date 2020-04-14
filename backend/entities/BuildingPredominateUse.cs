namespace Pims.Dal.Entities
{
    /// <summary>
    /// BuildingPredominateUse class, provides an entity for the datamodel to manage a list of building predominate uses.
    /// </summary>
    public class BuildingPredominateUse : LookupEntity<int>
    {
        #region Properties
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
        public BuildingPredominateUse(int id, string name) : base(id, name)
        {
        }
        #endregion
    }
}
