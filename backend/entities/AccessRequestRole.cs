using System;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// AccessRequestRole class, provides an entity for the datamodel to manage AccessRequest Roles.
    /// </summary>
    public class AccessRequestRole : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - The foreign key to the AccessRequest - PRIMARY KEY.
        /// </summary>
        /// <value></value>
        public int AccessRequestId { get; set; }

        /// <summary>
        /// get/set - The access request that belongs to an Role.
        /// </summary>
        /// <value></value>
        public AccessRequest AccessRequest { get; set; }

        /// <summary>
        /// get/set - The foreign key to the role the Role belongs to - PRIMARY KEY.
        /// </summary>
        /// <value></value>
        public Guid RoleId { get; set; }

        /// <summary>
        /// get/set - The Role the AccessRequest belongs to.
        /// </summary>
        /// <value></value>
        public Role Role { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a AccessRequestRole class.
        /// </summary>
        public AccessRequestRole() { }

        /// <summary>
        /// Create a new instance of a AccessRequestRole class.
        /// </summary>
        /// <param name="accessRequestId"></param>
        /// <param name="roleId"></param>
        public AccessRequestRole(int accessRequestId, Guid roleId)
        {
            this.AccessRequestId = accessRequestId;
            this.RoleId = roleId;
        }

        /// <summary>
        /// Create a new instance of a AccessRequestRole class.
        /// </summary>
        /// <param name="accessRequest"></param>
        /// <param name="role"></param>
        public AccessRequestRole(AccessRequest accessRequest, Role role)
        {
            this.AccessRequest = accessRequest;
            this.AccessRequestId = accessRequest?.Id ??
                throw new ArgumentNullException(nameof(accessRequest));
            this.Role = role;
            this.RoleId = role?.Id ??
                throw new ArgumentNullException(nameof(role));
        }
        #endregion
    }
}
