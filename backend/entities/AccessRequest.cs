using System;
using System.Collections.Generic;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// AccessRequest class, provides an entity for the datamodel to manage submitted access request forms for unauthorized users.
    /// </summary>
    public class AccessRequest : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - The primary key IDENTITY.
        /// </summary>
        /// <value></value>
        public int Id { get; set; }

        /// <summary>
        /// get/set - Foreign key to User
        /// </summary>
        /// <returns></returns>
        public Guid UserId { get; set; } // TODO: This shouldn't be nullable.

        /// <summary>
        /// get/set - the user originating this request
        /// </summary>
        /// <typeparam name="User"></typeparam>
        /// <returns></returns>
        public User User { get; set; }

        /// <summary>
        /// get/set - A note related to the access request.
        /// </summary>
        /// <value></value>
        public string Note { get; set; }

        /// <summary>
        /// get - the list of agencies that the user is requesting to be added to.
        /// </summary>
        /// <returns></returns>
        public ICollection<AccessRequestAgency> Agencies { get; private set; } = new List<AccessRequestAgency>();

        /// <summary>
        /// get - the list of roles this user is requesting.
        /// </summary>
        /// <typeparam name="UserRole"></typeparam>
        /// <returns></returns>
        public ICollection<AccessRequestRole> Roles { get; private set; } = new List<AccessRequestRole>();

        /// <summary>
        /// get - whether the request is approved, on hold or declined
        /// </summary>
        public AccessRequestStatus Status { get; set; } = AccessRequestStatus.OnHold;
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a User class.
        /// </summary>
        public AccessRequest() { }

        /// <summary>
        /// Create a new instance of a User class.
        /// </summary>
        /// <param name="requestUser"></param>
        public AccessRequest(User requestUser)
        {
            this.User = requestUser;
        }
        #endregion
    }
}
