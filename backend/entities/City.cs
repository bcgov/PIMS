namespace Pims.Dal.Entities
{
    /// <summary>
    /// City class, provides an entity for the datamodel to manage a list of cities.
    /// </summary>
    public class City : CodeEntity
    {
        #region Properties
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a City class.
        /// </summary>
        public City() { }

        /// <summary>
        /// Create a new instance of a City class.
        /// </summary>
        /// <param name="code"></param>
        /// <param name="name"></param>
        public City(string code, string name)
        {
            this.Code = code;
            this.Name = name;
        }
        #endregion
    }
}
