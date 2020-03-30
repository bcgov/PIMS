using System.Collections.Generic;
using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;

namespace Pims.Dal.Services
{
    /// <summary>
    /// IParcelService interface, provides functions to interact with parcels within the datasource.
    /// </summary>
    public interface IParcelService
    {
        IEnumerable<Parcel> Get(double neLat, double neLong, double swLat, double swLong);
        IEnumerable<Parcel> Get(ParcelFilter filter);
        Parcel Get(int id);
        Parcel Add(Parcel parcel);
        Parcel Update(Parcel parcel);
        void Remove(Parcel parcel);
    }
}
