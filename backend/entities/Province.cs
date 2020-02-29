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
        /// <param name="id"></param>
        /// <param name="name"></param>
        public Province(string id, string name)
        {
            if (String.IsNullOrWhiteSpace(id)) throw new ArgumentException($"Argument '{nameof(id)}' must be a valid value.", nameof(id));
            if (String.IsNullOrWhiteSpace(name)) throw new ArgumentException($"Argument '{nameof(name)}' must be a valid value.", nameof(name));

            this.Id = id;
            this.Name = name;
        }
        #endregion
    }
}
