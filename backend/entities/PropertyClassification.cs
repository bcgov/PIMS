namespace Pims.Dal.Entities
{
    /// <summary>
    /// PropertyClassificationClassification class, provides an entity for the datamodel to manage a list of property classifications.
    /// </summary>
    public class PropertyClassification : LookupEntity<int>
    {
        #region Properties
        /// <summary>
        /// get/set - Whether this classification is generally visible.
        /// </summary>
        public bool IsVisible { get; set; }
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
        /// <param name="isVisible"></param>
        public PropertyClassification(int id, string name, bool isVisible = true) : base(id, name)
        {
            this.IsVisible = isVisible;
        }
        #endregion
    }
}
