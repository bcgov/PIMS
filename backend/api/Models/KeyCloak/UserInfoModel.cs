using System;

namespace Pims.Api.Models.Keycloak
{
    /// <summary>
    /// UserModel class, provides a way to manage user information from the membership datasource.
    /// </summary>
    public class UserInfoModel
    {
        #region Properties
        public Guid Id { get; set; }
        public string username { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string email { get; set; }
        public bool emailVerified { get; set; }
        public string[] realmRoles { get; set; }
        public string[] clientRoles { get; set; }
        public string[] groups { get; set; }
        public int agency { get; set; }

        public int[] agencies { get; set; }
        #endregion
    }
}
