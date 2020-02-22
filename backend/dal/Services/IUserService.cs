using System;
using Pims.Dal.Entities;

namespace Pims.Dal.Services
{
    /// <summary>
    /// IUserService interface, provides functions to interact with users within the datasource.
    /// </summary>
    public interface IUserService
    {
        bool UserExists(Guid id);
        User Activate();
    }
}
