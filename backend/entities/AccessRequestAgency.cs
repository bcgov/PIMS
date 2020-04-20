using System;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// AccessRequestAgency class, provides an entity for the datamodel to manage access request agencies.
    /// </summary>
    public class AccessRequestAgency : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - The foreign key to the AccessRequest - PRIMARY KEY.
        /// </summary>
        /// <value></value>
        public int AccessRequestId { get; set; }

        /// <summary>
        /// get/set - The access request that belongs to an Agency.
        /// </summary>
        /// <value></value>
        public AccessRequest AccessRequest { get; set; }

        /// <summary>
        /// get/set - The foreign key to the role the Agency belongs to - PRIMARY KEY.
        /// </summary>
        /// <value></value>
        public int AgencyId { get; set; }

        /// <summary>
        /// get/set - The Agency the AccessRequest belongs to.
        /// </summary>
        /// <value></value>
        public Agency Agency { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a AccessRequestAgency class.
        /// </summary>
        public AccessRequestAgency() { }

        /// <summary>
        /// Create a new instance of a AccessRequestAgency class.
        /// </summary>
        /// <param name="accessRequestId"></param>
        /// <param name="agencyId"></param>
        public AccessRequestAgency(int accessRequestId, int agencyId)
        {
            this.AccessRequestId = accessRequestId;
            this.AgencyId = agencyId;
        }

        /// <summary>
        /// Create a new instance of a AccessRequestAgency class.
        /// </summary>
        /// <param name="accessRequest"></param>
        /// <param name="agency"></param>
        public AccessRequestAgency(AccessRequest accessRequest, Agency agency)
        {
            this.AccessRequest = accessRequest;
            this.AccessRequestId = accessRequest?.Id ??
                throw new ArgumentNullException(nameof(accessRequest));
            this.Agency = agency;
            this.AgencyId = agency?.Id ??
                throw new ArgumentNullException(nameof(agency));
        }
        #endregion
    }
}
