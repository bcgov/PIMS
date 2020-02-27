namespace Pims.Dal.Entities
using System.ComponentModel.DataAnnotations.Schema;
{
    /// <summary>
    /// PropertyClassificationClassification class, provides an entity for the datamodel to manage a list of property classifications.
    /// </summary>
    public class PropertyClassification : CodeEntity
    {
        [NotMapped]
        public override string Code
        {
            get { return Name; }
            set { throw new InvalidOperationException("PropertyClassification does not support setting the Code property"); }
        }

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
        public PropertyClassification(int id, string name)
        {
            this.Id = id;
            this.Name = name;
        }
        #endregion
    }
}
