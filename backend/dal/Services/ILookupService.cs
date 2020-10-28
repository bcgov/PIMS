using Pims.Dal.Entities;
using System.Collections.Generic;

namespace Pims.Dal.Services
{
    /// <summary>
    /// ILookupService interface, provides a way to fetch lookup lists from the datasource.
    /// </summary>
    public interface ILookupService : IService
    {
        IEnumerable<Agency> GetAgencies();
        IEnumerable<AdministrativeArea> GetAdministrativeAreas();
        IEnumerable<Province> GetProvinces();
        IEnumerable<PropertyClassification> GetPropertyClassifications();
        IEnumerable<PropertyType> GetPropertyTypes();
        IEnumerable<BuildingConstructionType> GetBuildingConstructionTypes();
        IEnumerable<BuildingPredominateUse> GetBuildingPredominateUses();
        IEnumerable<BuildingOccupantType> GetBuildingOccupantTypes();
        IEnumerable<Role> GetRoles();
        IEnumerable<TierLevel> GetTierLevels();
    }
}
