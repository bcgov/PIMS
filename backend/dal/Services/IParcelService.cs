using System.Collections.Generic;
using Pims.Dal.Entities;

namespace Pims.Dal.Services
{
    /// <summary>
    /// IParcelService interface, provides functions to interact with parcels within the datasource.
    /// </summary>
    public interface IParcelService
    {
        IEnumerable<Parcel> GetNoTracking(double? neLat = null, double? neLong = null, double? swLat = null, double? swLong = null, int? agencyId = null, int? propertyClassificationId = null);
        Parcel GetNoTracking(int id);
        Parcel Add(Parcel parcel);
        Parcel Update(Parcel parcel);
        void Remove(Parcel parcel);
    }
}
