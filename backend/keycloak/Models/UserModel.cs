using System;
using System.Collections.Generic;

namespace Pims.Keycloak.Models
{
    /// <summary>
    /// UserModel class, provides a way to manage users within keycloak.
    /// </summary>
    public class UserModel
    {
        #region Properties
        /// <summary>
        /// get/set - The unique key that identifies this user.
        /// </summary>
        /// <value></value>
        public Guid Id { get; set; }

        /// <summary>
        /// get/set - The unique user name for this user.
        /// </summary>
        /// <value></value>
        public string Username { get; set; }

        /// <summary>
        /// get/set - The user's given name.
        /// </summary>
        /// <value></value>
        public string FirstName { get; set; }

        /// <summary>
        /// get/set - The user's surname.
        /// </summary>
        /// <value></value>
        public string LastName { get; set; }

        /// <summary>
        /// get/set - The user's email.
        /// </summary>
        /// <value></value>
        public string Email { get; set; }

        /// <summary>
        /// get/set - Whether the user's email has been verified.
        /// </summary>
        /// <value></value>
        public bool? EmailVerified { get; set; }

        /// <summary>
        /// get/set - Whether the user is enabled.
        /// </summary>
        /// <value></value>
        public bool Enabled { get; set; }

        /// <summary>
        /// get/set - An array of realm roles the user belongs to.
        /// </summary>
        /// <value></value>
        public string[] RealmRoles { get; set; }

        /// <summary>
        /// get/set - An array of client roles the user belongs to.
        /// </summary>
        /// <value></value>
        public string[] ClientRoles { get; set; }

        /// <summary>
        /// get/set - An array of groups the user belongs to.
        /// </summary>
        /// <value></value>
        public string[] Groups { get; set; }

        /// <summary>
        /// get/set - A dictionary of user attributes.
        /// </summary>
        /// <value></value>
        public Dictionary<string, string[]> Attributes { get; set; }
        #endregion
    }
}
