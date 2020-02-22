using System.Collections.Generic;
using Pims.Dal.Entities;

namespace Pims.Dal.Services
{
    /// <summary>
    /// ILookupService interface, provides a way to fetch lookup lists from the datasource.
    /// </summary>
    public interface ILookupService
    {
        IEnumerable<Agency> GetAgenciesNoTracking();
        IEnumerable<City> GetCitiesNoTracking();
        IEnumerable<Province> GetProvincesNoTracking();
        IEnumerable<PropertyStatus> GetPropertyStatusNoTracking();
        IEnumerable<PropertyClassification> GetPropertyClassificationsNoTracking();
        IEnumerable<PropertyType> GetPropertyTypesNoTracking();
        IEnumerable<BuildingConstructionType> GetBuildingConstructionTypesNoTracking();
        IEnumerable<BuildingPredominateUse> GetBuildingPredominateUsesNoTracking();
    }
}
