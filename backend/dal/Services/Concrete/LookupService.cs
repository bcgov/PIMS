using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pims.Dal.Entities;

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
        /// <param name="logger"></param>
        public LookupService(PimsContext dbContext, ClaimsPrincipal user, ILogger<LookupService> logger) : base(dbContext, user, logger) { }
        #endregion

        #region Methods
        public IEnumerable<Agency> GetAgenciesNoTracking()
        {
            return this.Context.Agencies.AsNoTracking().OrderBy(a => a.SortOrder).ThenBy(a => a.Name).ToArray();
        }

        public IEnumerable<BuildingConstructionType> GetBuildingConstructionTypesNoTracking()
        {
            return this.Context.BuildingConstructionTypes.AsNoTracking().OrderBy(a => a.SortOrder).ThenBy(a => a.Name).ToArray();
        }

        public IEnumerable<BuildingPredominateUse> GetBuildingPredominateUsesNoTracking()
        {
            return this.Context.BuildingPredominateUses.AsNoTracking().OrderBy(a => a.SortOrder).ThenBy(a => a.Name).ToArray();
        }

        public IEnumerable<City> GetCitiesNoTracking()
        {
            return this.Context.Cities.AsNoTracking().OrderBy(a => a.SortOrder).ThenBy(a => a.Name).ToArray();
        }

        public IEnumerable<PropertyClassification> GetPropertyClassificationsNoTracking()
        {
            return this.Context.PropertyClassifications.AsNoTracking().OrderBy(a => a.SortOrder).ThenBy(a => a.Name).ToArray();
        }

        public IEnumerable<PropertyStatus> GetPropertyStatusNoTracking()
        {
            return this.Context.PropertyStatus.AsNoTracking().OrderBy(a => a.SortOrder).ThenBy(a => a.Name).ToArray();
        }

        public IEnumerable<PropertyType> GetPropertyTypesNoTracking()
        {
            return this.Context.PropertyTypes.AsNoTracking().OrderBy(a => a.SortOrder).ThenBy(a => a.Name).ToArray();
        }

        public IEnumerable<Province> GetProvincesNoTracking()
        {
            return this.Context.Provinces.AsNoTracking().OrderBy(a => a.Name).ToArray();
        }
        #endregion
    }
}
