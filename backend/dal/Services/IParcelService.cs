using System;
using System.Collections.Generic;
using System.Text;
using Pims.Dal.Entities;

namespace Pims.Dal.Services
{
    /**
     * Dal adapter for the Parcel Controller.
     */
    public interface IParcelService
    {
        IEnumerable<Parcel> GetParcels(double? neLat = null, double? neLong = null, double? swLat = null, double? swLong = null);
        Parcel GetParcel(int id);
        Parcel AddMyParcel(Parcel parcel);
        Parcel UpdateMyParcel(Parcel parcel);
        Parcel DeleteMyParcel(Parcel parcel);
    }
}
