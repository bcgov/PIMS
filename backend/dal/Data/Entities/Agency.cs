using System.Collections.Generic;

namespace Pims.Dal.Data.Entities
{
    /// <summary>
    /// Agency class, provides an entity for the datamodel to manage property agencies.
    /// </summary>
    public class Agency : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - The primary key IDENTITY SEED.
        /// </summary>
        /// <value></value>
        public int Id { get; set; }

        /// <summary>
        /// get/set - A unique code for the agency.
        /// </summary>
        /// <value></value>
        public string Code { get; set; }

        /// <summary>
        /// get/set - The name of the agency.
        /// </summary>
        /// <value></value>
        public string Name { get; set; }

        /// <summary>
        /// get/set - A description of the agency.
        /// </summary>
        /// <value></value>
        public string Description { get; set; }

        /// <summary>
        /// get/set - Whether this agency is disabled.
        /// </summary>
        /// <value></value>
        public bool IsDisabled { get; set; }

        /// <summary>
        /// get/set - The foreign key to the parent agency.
        /// </summary>
        /// <value></value>
        public int? ParentId { get; set; }

        /// <summary>
        /// get/set - The parent agency this agency belongs to.
        /// </summary>
        /// <value></value>
        public Agency Parent { get; set; }

        /// <summary>
        /// get - A collection of child agencies.
        /// </summary>
        /// <typeparam name="Agency"></typeparam>
        /// <returns></returns>
        public ICollection<Agency> Children { get; } = new List<Agency>();

        /// <summary>
        /// get - A collection of parcels this agency owns.
        /// </summary>
        /// <typeparam name="Parcel"></typeparam>
        /// <returns></returns>
        public ICollection<Parcel> Parcels { get; } = new List<Parcel>();

        /// <summary>
        /// get - A collection of users that belong to this agency.
        /// </summary>
        /// <typeparam name="UserAgency"></typeparam>
        /// <returns></returns>
        public ICollection<UserAgency> Users { get; } = new List<UserAgency>();
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a Agency class.
        /// </summary>
        public Agency() { }

        /// <summary>
        /// Create a new instance of a Agency class.
        /// </summary>
        /// <param name="code"></param>
        /// <param name="name"></param>
        public Agency(string code, string name)
        {
            this.Code = code;
            this.Name = name;
        }
        #endregion
    }
}
