using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;
using System.Collections.Generic;

namespace Pims.Dal.Services
{
    /// <summary>
    /// IParcelService interface, provides functions to interact with parcels within the datasource.
    /// </summary>
    public interface IParcelService : IService
    {
        IEnumerable<Parcel> Get(double neLat, double neLong, double swLat, double swLong);
        IEnumerable<Parcel> Get(ParcelFilter filter);
        Paged<Parcel> GetPage(ParcelFilter filter);
        Parcel Get(int id);
        Parcel Add(Parcel parcel);
        Parcel PendingUpdate(Parcel parcel);
        Parcel Update(Parcel parcel);
        Parcel UpdateFinancials(Parcel parcel);
        void Remove(Parcel parcel);
        bool IsPidAvailable(int parcelId, int PID);
        bool IsPinAvailable(int parcelId, int PIN);
    }
}
