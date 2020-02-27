using System;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// UserAgency class, provides an entity for the datamodel to manage user agencies.
    /// </summary>
    public class UserAgency : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - The foreign key to the user - PRIMARY KEY.
        /// </summary>
        /// <value></value>
        public Guid UserId { get; set; }

        /// <summary>
        /// get/set - The user that belongs to this agency.
        /// </summary>
        /// <value></value>
        public User User { get; set; }

        /// <summary>
        /// get/set - The foreign key to the agency the user belongs to - PRIMARY KEY.
        /// </summary>
        /// <value></value>
        public int AgencyId { get; set; }

        /// <summary>
        /// get/set - The agency the user belongs to.
        /// </summary>
        /// <value></value>
        public Agency Agency { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a UserAgency class.
        /// </summary>
        public UserAgency() { }

        /// <summary>
        /// Create a new instance of a UserAgency class.
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="agencyId"></param>
        public UserAgency(Guid userId, int agencyId)
        {
            this.UserId = userId;
            this.AgencyId = agencyId;
        }

        /// <summary>
        /// Create a new instance of a UserAgency class.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="agency"></param>
        public UserAgency(User user, Agency agency)
        {
            this.User = user;
            this.UserId = user?.Id ??
                throw new ArgumentNullException(nameof(user));
            this.Agency = agency;
            this.AgencyId = agency?.Id ??
                throw new ArgumentNullException(nameof(agency));
        }
        #endregion
    }
}
