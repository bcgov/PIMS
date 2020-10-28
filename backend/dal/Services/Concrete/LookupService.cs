using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pims.Dal.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace Pims.Dal.Services
{
    /// <summary>
    /// LookupService interface, provides a way to fetch lookup lists from the datasource.
    /// </summary>
    public class LookupService : BaseService, ILookupService
    {
        #region Constructors
        /// <summary>
        /// Creates a new instance of a LookService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="service"></param>
        /// <param name="logger"></param>
        public LookupService(PimsContext dbContext, ClaimsPrincipal user, IPimsService service, ILogger<LookupService> logger) : base(dbContext, user, service, logger) { }
        #endregion

        #region Methods
        /// <summary>
        /// Get all agencies sorted by SortOrder and Name
        /// </summary>
        public IEnumerable<Agency> GetAgencies()
        {
            return this.Context.Agencies.AsNoTracking().OrderBy(a => a.SortOrder).ThenBy(a => a.Name).ToArray();
        }

        /// <summary>
        /// Get all building construction types sorted by SortOrder and Name
        /// </summary>
        public IEnumerable<BuildingConstructionType> GetBuildingConstructionTypes()
        {
            return this.Context.BuildingConstructionTypes.AsNoTracking().OrderBy(a => a.SortOrder).ThenBy(a => a.Name).ToArray();
        }

        /// <summary>
        /// Get all predominate uses sorted by SortOrder and Name
        /// </summary>
        public IEnumerable<BuildingPredominateUse> GetBuildingPredominateUses()
        {
            return this.Context.BuildingPredominateUses.AsNoTracking().OrderBy(a => a.SortOrder).ThenBy(a => a.Name).ToArray();
        }

        /// <summary>
        /// Get all occupant types sorted by SortOrder and Name
        /// </summary>
        public IEnumerable<BuildingOccupantType> GetBuildingOccupantTypes()
        {
            return this.Context.BuildingOccupantTypes.AsNoTracking().OrderBy(a => a.SortOrder).ThenBy(a => a.Name).ToArray();
        }

        /// <summary>
        /// Get all administrative areas (city, municipality, district, etc) sorted by SortOrder and Name
        /// </summary>
        public IEnumerable<AdministrativeArea> GetAdministrativeAreas()
        {
            return this.Context.AdministrativeAreas.AsNoTracking().OrderBy(a => a.SortOrder).ThenBy(a => a.Name).ToArray();
        }

        /// <summary>
        /// Get all property classifications sorted by SortOrder and Name
        /// </summary>
        public IEnumerable<PropertyClassification> GetPropertyClassifications()
        {
            return this.Context.PropertyClassifications.AsNoTracking().OrderBy(a => a.SortOrder).ThenBy(a => a.Name).ToArray();
        }

        /// <summary>
        /// Get all property types sorted by SortOrder and Name
        /// </summary>
        public IEnumerable<PropertyType> GetPropertyTypes()
        {
            return this.Context.PropertyTypes.AsNoTracking().OrderBy(a => a.SortOrder).ThenBy(a => a.Name).ToArray();
        }

        /// <summary>
        /// Get all provinces sorted by Name
        /// </summary>
        public IEnumerable<Province> GetProvinces()
        {
            return this.Context.Provinces.AsNoTracking().OrderBy(a => a.Name).ToArray();
        }

        /// <summary>
        /// Get all roles sorted by Name
        /// </summary>
        public IEnumerable<Role> GetRoles()
        {
            return this.Context.Roles.AsNoTracking().OrderBy(a => a.Name).ToArray();
        }

        /// <summary>
        /// Get all the tier levels sorted by SortOrder and Name.
        /// </summary>
        /// <returns></returns>
        public IEnumerable<TierLevel> GetTierLevels()
        {
            return this.Context.TierLevels.AsNoTracking().OrderBy(t => t.SortOrder).ThenBy(t => t.Name).ToArray();
        }
        #endregion
    }
}
