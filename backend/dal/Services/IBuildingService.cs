using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;
using System.Collections.Generic;

namespace Pims.Dal.Services
{
    /// <summary>
    /// IBuildingService interface, provides functions to interact with buildings within the datasource.
    /// </summary>
    public interface IBuildingService : IService
    {
        IEnumerable<Building> Get(double neLat, double neLong, double swLat, double swLong);
        IEnumerable<Building> Get(BuildingFilter filter);
        Paged<Building> GetPage(BuildingFilter filter);
        Building Get(int id);
        Building Add(Building parcel);
        Building Update(Building parcel);
        Building UpdateFinancials(Building parcel);
        void Remove(Building parcel);
    }
}
