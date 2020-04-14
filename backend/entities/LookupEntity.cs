using System;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// LookupEntity class, provides an entity for the datamodel to manage entities that represent codified values.
    /// </summary>
    /// <typeparam name="TKey"></typeparam>
    public abstract class LookupEntity<TKey> : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - A unique id for the code.
        /// </summary>
        /// <value></value>
        public TKey Id { get; set; }

        /// <summary>
        /// get/set - The name of the code.
        /// </summary>
        /// <value></value>
        public string Name { get; set; }

        /// <summary>
        /// get/set - Whether this code is disabled.
        /// </summary>
        /// <value></value>
        public bool IsDisabled { get; set; }

        /// <summary>
        /// get/set - The sort order of the lookup item.
        /// </summary>
        /// <value></value>
        public int SortOrder { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a LookupEntity class.
        /// </summary>
        public LookupEntity() { }

        /// <summary>
        /// Create a new instance of a LookupEntity class.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        public LookupEntity(TKey id, string name)
        {
            if (String.IsNullOrWhiteSpace(name)) throw new ArgumentException($"Argument '{nameof(name)}' must have a valid value.", nameof(name));

            this.Id = id;
            this.Name = name;
        }
        #endregion
    }
}
