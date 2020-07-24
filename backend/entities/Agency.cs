using System.Collections.Generic;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// Agency class, provides an entity for the datamodel to manage property agencies.
    /// </summary>
    public class Agency : CodeEntity<int>
    {
        #region Properties
        /// <summary>
        /// get/set - A description of the code.
        /// </summary>
        /// <value></value>
        public string Description { get; set; }

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
        /// get/set - An email address for the agency.
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// get/set - Whether notifications should be sent to this agency.
        /// </summary>
        public bool SendEmail { get; set; } = true;

        /// <summary>
        /// get/set - The name or title of whom the notification should be addressed to.
        /// </summary>
        public string AddressTo { get; set; }

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
        /// get - A collection of buildings this agency owns.
        /// </summary>
        /// <typeparam name="Building"></typeparam>
        /// <returns></returns>
        public ICollection<Building> Buildings { get; } = new List<Building>();

        /// <summary>
        /// get - A collection of users that belong to this agency.
        /// </summary>
        /// <typeparam name="UserAgency"></typeparam>
        /// <returns></returns>
        public ICollection<UserAgency> Users { get; } = new List<UserAgency>();

        /// <summary>
        /// get - A collection of projects that belong to this agency.
        /// </summary>
        public ICollection<Project> Projects { get; } = new List<Project>();

        /// <summary>
        /// get - A collection of responses to project notifications.
        /// </summary>
        public ICollection<ProjectAgencyResponse> ProjectResponses { get; } = new List<ProjectAgencyResponse>();

        /// <summary>
        /// get/set - A collection of notifications sent to this agency.
        /// </summary>
        public ICollection<NotificationQueue> Notifications { get; } = new List<NotificationQueue>();
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
