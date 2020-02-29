namespace Pims.Dal.Entities
{
    /// <summary>
    /// PropertyClassificationClassification class, provides an entity for the datamodel to manage a list of property classifications.
    /// </summary>
    public class PropertyClassification : LookupEntity
    {
        #region Properties
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a PropertyClassification class.
        /// </summary>
        public PropertyClassification() { }

        /// <summary>
        /// Create a new instance of a PropertyClassification class.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        public PropertyClassification(int id, string name) : base(id, name)
        {
        }
        #endregion
    }
}
