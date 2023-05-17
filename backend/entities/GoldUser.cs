using System.Collections.Generic;

namespace Pims.Dal.Entities
{
    /// <summary>
    /// Gold User class, used for describing a User that has an array of string roles provided by Keycloak Gold.
    /// </summary>
    public class GoldUser : User
    {
        public IEnumerable<string> GoldUserRoles { get; set; }

        public GoldUser() { }
        public GoldUser(User user)
        {
            this.Id = user.Id;
            this.KeycloakUserId = user.KeycloakUserId;
            this.Username = user.Username;
            this.DisplayName = user.DisplayName;
            this.FirstName = user.FirstName;
            this.MiddleName = user.MiddleName;
            this.LastName = user.LastName;
            this.Email = user.Email;
            this.Position = user.Position;
            this.IsDisabled = user.IsDisabled;
            this.EmailVerified = user.EmailVerified;
            this.Note = user.Note;
            this.IsSystem = user.IsSystem;
            this.LastLogin = user.LastLogin;
            this.ApprovedById = user.ApprovedById;
            this.ApprovedBy = user.ApprovedBy;
            this.ApprovedOn = user.ApprovedOn;
            this.Agencies = user.Agencies;
            this.Roles = user.Roles;
            this.RowVersion = user.RowVersion;
        }
    }


}