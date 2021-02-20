using System;
using System.Collections.Generic;

namespace Pims.Api.Areas.Reports.Models.User
{
    /// <summary>
    /// UserModel class, provides a model that represents a user.
    /// </summary>
    public class UserModel : Pims.Api.Models.BaseModel
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
        /// get/set - User's last login timestamp
        /// </summary>
        public DateTime? LastLogin { get; set; }

        /// <summary>
        /// get/set - Who approved this user.
        /// </summary>
        public string ApprovedBy { get; set; }

        /// <summary>
        /// get/set - When this user was approved on.
        /// </summary>
        public DateTime? ApprovedOn { get; set; }

        /// <summary>
        /// get/set - A comma-separated list of agencies the user belongs to.
        /// </summary>
        public string Agencies { get; set; }

        /// <summary>
        /// get/set - A comma-separated list of roles the user is a member of.
        /// </summary>
        public string Roles { get; set; }
        #endregion
    }
}
