using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;
using System;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// IClaimService interface, provides a service layer to administer roles within the datasource.
    /// </summary>
    public interface IClaimService : IBaseService<Claim>
    {
        Paged<Claim> Get(int page, int quantity, string name = null);
        Claim Get(Guid id);
        Claim GetByName(string name);
        int RemoveAll(Guid[] exclude);
    }
}
