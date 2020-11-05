namespace Pims.Dal.Entities
{
    /// <summary>
    /// AdministrativeArea class, provides an entity for the datamodel to manage a list of administrative areas (city, municipality, district, etc.).
    /// </summary>
    public class AdministrativeArea : LookupEntity<int>
    {
        #region Properties
        /// <summary>
        /// get/set - An appreviated name.
        /// </summary>
        public string Abbreviation { get; set; }

        /// <summary>
        /// get/set - A description of the boundary type for this area (o.e. Legal).
        /// </summary>
        public string BoundaryType { get; set; }

        /// <summary>
        /// get/set - The parent group name for this area.
        /// </summary>
        public string GroupName { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a AdministrativeArea class.
        /// </summary>
        public AdministrativeArea() { }

        /// <summary>
        /// Create a new instance of a AdministrativeArea class.
        /// </summary>
        /// <param name="name"></param>
        public AdministrativeArea(string name)
        {
            this.Name = name;
        }
        #endregion
    }
}
