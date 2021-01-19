using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;
using System.Collections.Generic;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// IParcelService interface, provides a service layer to administer parcels within the datasource.
    /// </summary>
    public interface IParcelService : IBaseService<Parcel>
    {
        Paged<Parcel> Get(ParcelFilter filter);
        Parcel Get(int id);
        Parcel GetByPid(int pid);
        Parcel GetByPidWithoutTracking(int pid);
        IEnumerable<Parcel> Add(IEnumerable<Parcel> parcels);
        void UpdateFinancials(Parcel parcel);
    }
}
