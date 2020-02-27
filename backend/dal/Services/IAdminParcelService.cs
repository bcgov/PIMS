using System;
using System.Collections.Generic;
using System.Text;
using Pims.Dal.Entities;

namespace Pims.Dal.Services
{
    /**
     * DAL adapter for the admin parcel controller.
     */
    public interface IAdminParcelService
    {
        IEnumerable<Parcel> GetParcels(int page, int quantity, string sort);
        Parcel GetParcel(int id);
        Parcel GetParcelByPid(int pid);
        Parcel AddParcel(Parcel parcel);
        Parcel[] AddParcels(Parcel[] parcels);
        Parcel UpdateParcel(Parcel parcel);
        Parcel DeleteParcel(Parcel parcel);
    }
}
