namespace Pims.Dal.Data.Entities
{
    /// <summary>
    /// PropertyType class, provides an entity for the datamodel to manage a list of property types.
    /// </summary>
    public class PropertyType : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - The primary key IDENTITY SEED.
        /// </summary>
        /// <value></value>
        public int Id { get; set; }

        /// <summary>
        /// get/set - The unique name of this building type construction.
        /// </summary>
        /// <value></value>
        public string Name { get; set; }

        /// <summary>
        /// get/set - Whether this row is disabled.
        /// </summary>
        /// <value></value>
        public bool IsDisabled { get; set; }
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
        public PropertyType(int id, string name)
        {
            this.Id = id;
            this.Name = name;
        }
        #endregion
    }
}
