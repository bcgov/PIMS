namespace Pims.Dal.Entities
{
    /// <summary>
    /// PropertyType class, provides an entity for the datamodel to manage a list of property types.
    /// </summary>
    public class PropertyType : LookupEntity<int>
    {
        #region Properties
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a PropertyType class.
        /// </summary>
        public PropertyType() { }

        /// <summary>
        /// Create a new instance of a PropertyType class.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        public PropertyType(int id, string name) : base(id, name)
        {
        }
        #endregion
    }
}
