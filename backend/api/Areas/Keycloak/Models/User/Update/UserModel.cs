using System;
using System.Collections.Generic;

namespace Pims.Api.Areas.Keycloak.Models.User.Update
{
    /// <summary>
    /// UserModel class, provides a model that represents a user.
    /// </summary>
    public class UserModel : BaseModel
    {
        #region Properties
        /// <summary>
        /// get/set - An unique identifier for the user.
        /// </summary>
        /// <value></value>
        public Guid Id { get; set; }

        /// <summary>
        /// get/set - A unique username to identify the user.
        /// </summary>
        /// <value></value>
        public string Username { get; set; }

        /// <summary>
        /// get/set - The user's display name.
        /// </summary>
        /// <value></value>
        public string DisplayName { get; set; }

        /// <summary>
        /// get/set - The user's position title.
        /// </summary>
        /// <value></value>
        public string Position { get; set; }

        /// <summary>
        /// get/set - The user's given name.
        /// </summary>
        /// <returns></returns>
        public string FirstName { get; set; }

        /// <summary>
        /// get/set - The user's middle name.
        /// </summary>
        /// <returns></returns>
        public string MiddleName { get; set; }

        /// <summary>
        /// get/set - The user's last name.
        /// </summary>
        /// <returns></returns>
        public string LastName { get; set; }

        /// <summary>
        /// get/set - The user's email.
        /// </summary>
        /// <returns></returns>
        public string Email { get; set; }

        /// <summary>
        /// get/set - Whether the user is disabled.
        /// </summary>
        /// <returns></returns>
        public bool IsDisabled { get; set; }

        /// <summary>
        /// get/set - Whether the email has been verified.
        /// </summary>
        /// <value></value>
        public bool EmailVerified { get; set; }

        /// <summary>
        /// get/set - A note about the user.
        /// </summary>
        /// <value></value>
        public string Note { get; set; }

        /// <summary>
        /// get/set - An array of agencies the user belongs to.
        /// </summary>
        /// <returns></returns>
        public IEnumerable<UserAgencyModel> Agencies { get; set; } = new List<UserAgencyModel>();

        /// <summary>
        /// get/set - An array of roles the user is a member of.
        /// </summary>
        /// <returns></returns>
        public IEnumerable<UserRoleModel> Roles { get; set; } = new List<UserRoleModel>();
        #endregion
    }
}
