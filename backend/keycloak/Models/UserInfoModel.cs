using System;

namespace Pims.Keycloak.Models
{
    /// <summary>
    /// UserInfoModel class, provides a way to manage user information from the membership datasource.
    /// </summary>
    public class UserInfoModel
    {
        #region Properties
        /// <summary>
        /// get/set - The unique key for the user.
        /// </summary>
        /// <value></value>
        public Guid Id { get; set; }

        /// <summary>
        /// get/set - The username for the user.
        /// </summary>
        /// <value></value>
        public string Username { get; set; }

        /// <summary>
        /// get/set - The given name of the user.
        /// </summary>
        /// <value></value>
        public string FirstName { get; set; }

        /// <summary>
        /// get/set - The surname of the user.
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
        public bool EmailVerified { get; set; }

        /// <summary>
        /// get/set - An array of realm roles the user is a member of.
        /// </summary>
        /// <value></value>
        public string[] RealmRoles { get; set; }

        /// <summary>
        /// get/set - An array of client roles the user is a member of.
        /// </summary>
        /// <value></value>
        public string[] ClientRoles { get; set; }

        /// <summary>
        /// get/set - An array of groups the user is a member of.
        /// </summary>
        /// <value></value>
        public string[] Groups { get; set; }

        /// <summary>
        /// get/set - An array of agencies the user is a member of.
        /// </summary>
        /// <value></value>
        public int[] Agencies { get; set; }
        #endregion
    }
}
