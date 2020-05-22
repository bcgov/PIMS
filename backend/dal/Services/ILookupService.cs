using System.Collections.Generic;
using Pims.Dal.Entities;

namespace Pims.Dal.Services
{
    /// <summary>
    /// ILookupService interface, provides a way to fetch lookup lists from the datasource.
    /// </summary>
    public interface ILookupService
    {
        IEnumerable<Agency> GetAgencies();
        IEnumerable<City> GetCities();
        IEnumerable<Province> GetProvinces();
        IEnumerable<PropertyStatus> GetPropertyStatus();
        IEnumerable<PropertyClassification> GetPropertyClassifications();
        IEnumerable<PropertyType> GetPropertyTypes();
        IEnumerable<BuildingConstructionType> GetBuildingConstructionTypes();
        IEnumerable<BuildingPredominateUse> GetBuildingPredominateUses();
        IEnumerable<BuildingOccupantType> GetBuildingOccupantTypes();
        IEnumerable<Role> GetRoles();
        IEnumerable<TierLevel> GetTierLevels();
    }
}
