using System;

namespace Pims.Api.Data.Entities
{
    /// <summary>
    /// City class, provides an entity for the datamodel to manage a list of cities.
    /// </summary>
    public class City : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - The primary key IDENTITY SEED.
        /// </summary>
        /// <value></value>
        public int Id { get; set; }

        /// <summary>
        /// get/set - The name of the city.
        /// </summary>
        /// <value></value>
        public string Name { get; set; }

        /// <summary>
        /// get/set - The unique code to identify this city.
        /// </summary>
        /// <value></value>
        public string Code { get; set; }

        /// <summary>
        /// get/set - Whether this row is disabled.
        /// </summary>
        /// <value></value>
        public bool IsDisabled { get; set; }
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
