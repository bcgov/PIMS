using System;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// Province class, provides an entity for the datamodel to manage a list of provinces.
    /// </summary>
    public class Province : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - The primary key.
        /// </summary>
        /// <value></value>
        public string Id { get; set; }

        /// <summary>
        /// get/set - The unique name for this province.
        /// </summary>
        /// <value></value>
        public string Name { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a Province class.
        /// </summary>
        public Province() { }

        /// <summary>
        /// Create a new instance of a Province class.
        /// </summary>
        /// <param name="code"></param>
        /// <param name="name"></param>
        public Province(string code, string name)
        {
            this.Id = code;
            this.Name = name;
            this.CreatedOn = DateTime.UtcNow;
        }
        #endregion
    }
}
