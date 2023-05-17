using System.Collections.Generic;
using Pims.Api.Areas.Admin.Models.User;

namespace Pims.Api.Areas.Admin.Models.GoldUser
{
    /// <summary>
    /// Extension of the UserModel class, this class adds a new array which represents keycloak gold roles
    /// </summary>
    public class GoldUser : UserModel
    {
        public IEnumerable<string> GoldUserRoles { get; set; }
    }
}