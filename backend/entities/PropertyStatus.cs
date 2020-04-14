namespace Pims.Dal.Entities
{
    /// <summary>
    /// PropertyStatusStatus class, provides an entity for the datamodel to manage a list of property status.
    /// </summary>
    public class PropertyStatus : LookupEntity<int>
    {
        #region Properties
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a PropertyStatus class.
        /// </summary>
        public PropertyStatus() { }

        /// <summary>
        /// Create a new instance of a PropertyStatus class.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        public PropertyStatus(int id, string name) : base(id, name)
        {
        }
        #endregion
    }
}
