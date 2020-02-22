using System;

namespace Pims.Api.Models
{
    public class UserModel
    {
        #region Properties
        public Guid Id { get; set; }

        public string DisplayName { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }
        #endregion
    }
}
