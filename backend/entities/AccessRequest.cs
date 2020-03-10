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
        public Guid Id { get; set; }

        /// <summary>
        /// get/set - Whether the request is disabled.
        /// </summary>
        /// <value></value>
        public bool IsDisabled { get; set; }

        /// <summary>
        /// get/set - Whether the request has been granted
        /// </summary>
        /// <value></value>
        public bool? IsGranted { get; set; }

        /// <summary>
        /// Foreign key to User
        /// </summary>
        /// <returns></returns>
        public Guid? UserId { get; set; }

        /// <summary>
        /// get - the user originating this request
        /// </summary>
        /// <typeparam name="User"></typeparam>
        /// <returns></returns>
        public User User { get; set; }

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
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a User class.
        /// </summary>
        public AccessRequest() { }

        /// <summary>
        /// Create a new instance of a User class.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="displayName"></param>
        public AccessRequest(Guid id, User requestUser)
        {
            this.Id = id;
            this.User = requestUser;
        }
        #endregion
    }
}
