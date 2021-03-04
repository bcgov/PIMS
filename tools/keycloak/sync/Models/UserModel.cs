using System;
using System.Collections.Generic;
using System.Linq;

namespace Pims.Tools.Keycloak.Sync.Models
{

    /// <summary>
    /// UserModel class, provides a model that represents a user.
    /// </summary>
    public class UserModel : BaseModel
    {
        #region Properties
        /// <summary>
        /// get/set - The user's unique identifier.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// get/set - The user's unique identity.
        /// </summary>
        public string Username { get; set; }

        /// <summary>
        /// get/set - The user's position title.
        /// </summary>
        public string Position { get; set; }

        /// <summary>
        /// get/set - The user's display name.
        /// </summary>
        public string DisplayName { get; set; }

        /// <summary>
        /// get/set - The user's given name.
        /// </summary>
        public string FirstName { get; set; }

        /// <summary>
        /// get/set - The user's middlename.
        /// </summary>
        public string MiddleName { get; set; }

        /// <summary>
        /// get/set - The user's surname.
        /// </summary>
        public string LastName { get; set; }

        /// <summary>
        /// get/set - The user's email.
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// get/set - Whether the user is disabled.
        /// </summary>
        /// <value></value>
        public bool IsDisabled { get; set; }

        /// <summary>
        /// get/set - Whether the email has been verified.
        /// </summary>
        /// <value></value>
        public bool EmailVerified { get; set; }

        /// <summary>
        /// get/set - A note about the user.
        /// </summary>
        public string Note { get; set; }

        /// <summary>
        /// get/set - An array of agencies the user belongs to.
        /// </summary>
        public IEnumerable<AgencyModel> Agencies { get; set; } = new List<AgencyModel>();

        /// <summary>
        /// get/set - An array of roles the user is a member of.
        /// </summary>
        public IEnumerable<RoleModel> Roles { get; set; } = new List<RoleModel>();
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a UserModel class.
        /// </summary>
        public UserModel() { }

        /// <summary>
        /// Creates a new instance of a UserModel class, initializes with specified arguments.
        /// </summary>
        /// <param name="user"></param>
        public UserModel(Core.Keycloak.Models.UserModel user)
        {
            this.Id = user.Id;
            this.Username = user.Username;
            this.Position = user.Attributes?.ContainsKey("position") ?? false ? user.Attributes["position"].FirstOrDefault() : null;
            this.FirstName = user.FirstName;
            this.MiddleName = user.Attributes?.ContainsKey("middleName") ?? false ? user.Attributes["middleName"].FirstOrDefault() : null;
            this.LastName = user.LastName;
            this.DisplayName = user.Attributes?.ContainsKey("displayName") ?? false ? user.Attributes["displayName"].FirstOrDefault() : $"{this.LastName}, {this.FirstName}";
            this.Email = user.Email;
            this.IsDisabled = !user.Enabled;
            this.EmailVerified = user.EmailVerified;
            this.Agencies = user.Attributes?.ContainsKey("agencies") ?? false ? user.Attributes["agencies"].Select(a => {
                if (Int32.TryParse(a, out int id))
                    return new AgencyModel() { Id = id };
                return null;
            }).Where(a => a != null).Distinct().ToList() : null;
        }
        #endregion
    }
}
