using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// CodeEntity class, provides an entity for the datamodel to manage entities that represent codified values.
    /// </summary>
    public abstract class CodeEntity : LookupEntity
    {
        #region Properties
        /// <summary>
        /// get/set - A unique code for the lookup.
        /// </summary>
        /// <value></value>
        public string Code { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a CodeEntity class.
        /// </summary>
        public CodeEntity() { }

        /// <summary>
        /// Create a new instance of a CodeEntity class.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        public CodeEntity(int id, string code, string name) : base(id, name)
        {
            if (String.IsNullOrWhiteSpace(code)) throw new ArgumentException($"Argument '{nameof(code)}' must have a valid value.", nameof(code));

            this.Code = code;
        }
        #endregion
    }
}
