using System;

namespace Pims.Api.Data.Entities
{
    /// <summary>
    /// PropertyClassificationClassification class, provides an entity for the datamodel to manage a list of property classifications.
    /// </summary>
    public class PropertyClassification : CodeEntity
    {
        public override string Type
        {
            get { return "propertyClassification"; }
        }

        #region Constructors
        /// <summary>
        /// Create a new instance of a PropertyClassification class.
        /// </summary>
        public PropertyClassification () { }

        /// <summary>
        /// Create a new instance of a PropertyClassification class.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        public PropertyClassification (int id, string name)
        {
            this.Id = id;
            this.Name = name;
        }
        #endregion
    }
}
