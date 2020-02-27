using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Pims.Api.Data.Entities
{
    /// <summary>
    /// CodeEntity class, provides an entity for the datamodel to manage entities that represent codified values.
    /// </summary>
    public abstract class CodeEntity : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - A unique id for the code.
        /// </summary>
        /// <value></value>
        public int Id { get; set; }

        /// <summary>
        /// get/set - A unique code for the lookup.
        /// </summary>
        /// <value></value>
        public virtual string Code { get; set; }

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
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a CodeEntity class.
        /// </summary>
        public CodeEntity () { }

        /// <summary>
        /// Create a new instance of a CodeEntity class.
        /// </summary>
        /// <param name="code"></param>
        /// <param name="name"></param>
        public CodeEntity (int id, string name)
        {
            this.Id = id;
            this.Name = name;
        }
        #endregion
    }
}
