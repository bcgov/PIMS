using System;
using Pims.Dal.Models;

namespace Pims.Api.Areas.Admin.Models
{
    public class UserModel : BaseModel
    {
        #region Properties
        public Guid Id { get; set; }

        public string DisplayName { get; set; }

        public string FirstName { get; set; }

        public string MiddleName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }
        #endregion
    }
}
