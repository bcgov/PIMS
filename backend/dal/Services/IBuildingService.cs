using System.Collections.Generic;
using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;

namespace Pims.Dal.Services
{
    /// <summary>
    /// IBuildingService interface, provides functions to interact with buildings within the datasource.
    /// </summary>
    public interface IBuildingService
    {
        IEnumerable<Building> GetNoTracking(double neLat, double neLong, double swLat, double swLong);
        IEnumerable<Building> GetNoTracking(BuildingFilter filter);
        Building GetNoTracking(int id);
        Building Add(Building parcel);
        Building Update(Building parcel);
        void Remove(Building parcel);
    }
}
