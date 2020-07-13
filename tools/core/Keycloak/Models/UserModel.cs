using System;
using System.Collections.Generic;

namespace Pims.Tools.Core.Keycloak.Models
{
    /// <summary>
    /// UserModel class, provides a model to represent a keycloak user.
    /// </summary>
    public class UserModel
    {
        #region Properties
        /// <summary>
        /// get/set - The primary key for the user.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// get/set - A unique username to identify the user.
        /// </summary>
        public string Username { get; set; }

        /// <summary>
        /// get/set - Whether the user is enabled.
        /// </summary>
        public bool Enabled { get; set; }

        /// <summary>
        /// get/set - I don't know...
        /// </summary>
        public bool Totp { get; set; }

        /// <summary>
        /// get/set - Whether the user's email has been verified.
        /// </summary>
        public bool EmailVerified { get; set; }

        /// <summary>
        /// get/set - The user's first name.
        /// </summary>
        public string FirstName { get; set; }

        /// <summary>
        /// get/set - The user's last name.
        /// </summary>
        public string LastName { get; set; }

        /// <summary>
        /// get/set - The user's email.
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// get/set - A dictionary of attributes.
        /// </summary>
        public Dictionary<string, string[]> Attributes { get; set; }
        #endregion
    }
}
