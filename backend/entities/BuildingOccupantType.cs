namespace Pims.Dal.Entities
{
    /// <summary>
    /// BuildingOccupantType class, provides an entity for the datamodel to manage a list of building occupant types.
    /// </summary>
    public class BuildingOccupantType : LookupEntity<int>
    {
        #region Properties
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a BuildingOccupantType class.
        /// </summary>
        public BuildingOccupantType() { }

        /// <summary>
        /// Create a new instance of a BuildingOccupantType class.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        public BuildingOccupantType(int id, string name) : base(id, name)
        {
        }
        #endregion
    }
}
