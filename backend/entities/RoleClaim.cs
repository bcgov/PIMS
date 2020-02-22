using System;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// RoleClaim class, provides an entity for the datamodel to manage role agencies.
    /// </summary>
    public class RoleClaim : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - The foreign key to the role - PRIMARY KEY.
        /// </summary>
        /// <value></value>
        public Guid RoleId { get; set; }

        /// <summary>
        /// get/set - The role that belongs to this claim.
        /// </summary>
        /// <value></value>
        public Role Role { get; set; }

        /// <summary>
        /// get/set - The foreign key to the claim the role belongs to - PRIMARY KEY.
        /// </summary>
        /// <value></value>
        public Guid ClaimId { get; set; }

        /// <summary>
        /// get/set - The claim the role belongs to.
        /// </summary>
        /// <value></value>
        public Claim Claim { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a RoleClaim class.
        /// </summary>
        public RoleClaim() { }

        /// <summary>
        /// Create a new instance of a RoleClaim class.
        /// </summary>
        /// <param name="roleId"></param>
        /// <param name="claimId"></param>
        public RoleClaim(Guid roleId, Guid claimId)
        {
            this.RoleId = roleId;
            this.ClaimId = claimId;
        }

        /// <summary>
        /// Create a new instance of a RoleClaim class.
        /// </summary>
        /// <param name="role"></param>
        /// <param name="claim"></param>
        public RoleClaim(Role role, Claim claim)
        {
            this.Role = role;
            this.RoleId = role?.Id ??
                throw new ArgumentNullException(nameof(role));
            this.Claim = claim;
            this.ClaimId = claim?.Id ??
                throw new ArgumentNullException(nameof(claim));
        }
        #endregion
    }
}
