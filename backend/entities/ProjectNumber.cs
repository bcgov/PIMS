namespace Pims.Dal.Entities
{
    /// <summary>
    /// ProjectNumber class, provides an entity for the datamodel to manage project numbers.
    /// </summary>
    public class ProjectNumber : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - The primary key provides a unique identity for the project.
        /// </summary>
        public int Id { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a ProjectNumber class.
        /// </summary>
        public ProjectNumber() { }
        #endregion

        #region Methods
        /// <summary>
        /// Returns the `Id` property to identify this project number.
        /// </summary>
        /// <returns></returns>
        public override string ToString()
        {
            return this.Id.ToString();
        }
        #endregion
    }
}
