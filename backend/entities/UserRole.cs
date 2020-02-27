using System;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// UserRole class, provides an entity for the datamodel to manage user agencies.
    /// </summary>
    public class UserRole : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - The foreign key to the user - PRIMARY KEY.
        /// </summary>
        /// <value></value>
        public Guid UserId { get; set; }

        /// <summary>
        /// get/set - The user that belongs to this role.
        /// </summary>
        /// <value></value>
        public User User { get; set; }

        /// <summary>
        /// get/set - The foreign key to the role the user belongs to - PRIMARY KEY.
        /// </summary>
        /// <value></value>
        public Guid RoleId { get; set; }

        /// <summary>
        /// get/set - The role the user belongs to.
        /// </summary>
        /// <value></value>
        public Role Role { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a UserRole class.
        /// </summary>
        public UserRole() { }

        /// <summary>
        /// Create a new instance of a UserRole class.
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="roleId"></param>
        public UserRole(Guid userId, Guid roleId)
        {
            this.UserId = userId;
            this.RoleId = roleId;
        }

        /// <summary>
        /// Create a new instance of a UserRole class.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="role"></param>
        public UserRole(User user, Role role)
        {
            this.User = user;
            this.UserId = user?.Id ??
                throw new ArgumentNullException(nameof(user));
            this.Role = role;
            this.RoleId = role?.Id ??
                throw new ArgumentNullException(nameof(role));
        }
        #endregion
    }
}
