namespace Pims.Dal.Entities
{
    /// <summary>
    /// TierLevel class, provides an entity for the datamodel to manage a list of project tier levels.
    /// </summary>
    public class TierLevel : LookupEntity<int>
    {
        #region Properties
        /// <summary>
        /// get/set - A description of the tier.
        /// </summary>
        public string Description { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a TierLevel class.
        /// </summary>
        public TierLevel() { }

        /// <summary>
        /// Create a new instance of a TierLevel class.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        public TierLevel(int id, string name) : base(id, name)
        {
        }
        #endregion
    }
}
