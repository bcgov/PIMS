using System.Security.Claims;
using Pims.Dal.Services;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// IPimsAdminService interface, provides a way to interface with the backend datasource.
    /// </summary>
    public interface IPimsAdminService
    {
        #region Properties
        ClaimsPrincipal Principal { get; }
        IUserService User { get; }
        IRoleService Role { get; }
        IParcelService Parcel { get; }
        IBuildingService Building { get; }
        IAddressService Address { get; }
        IProvinceService Province { get; }
        ICityService City { get; }
        #endregion

        #region Methods
        int CommitTransaction();
        #endregion
    }
}
