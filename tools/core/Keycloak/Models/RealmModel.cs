using System.Collections.Generic;

namespace Pims.Tools.Core.Keycloak.Models
{
    /// <summary>
    /// RealmModel class, provides a way to represent a Keycloak realm.
    /// </summary>
    public class RealmModel
    {
        #region Properties
        /// <summary>
        /// get/set - The unique id to identify the realm.
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        /// get/set - The realm name.
        /// </summary>
        public string Realm { get; set; }

        /// <summary>
        /// get/set - The realm display name.
        /// </summary>
        public string DisplayName { get; set; }

        /// <summary>
        /// get/set - The realm display name as HTML.
        /// </summary>
        public string DisplayNameHtml { get; set; }

        /// <summary>
        /// get/set - Whether realm is enabled.
        /// </summary>
        public bool Enabled { get; set; }

        /// <summary>
        /// get/set - Whether SSL is required.
        /// </summary>
        public string SslRequired { get; set; }

        /// <summary>
        /// get/set - Whether to allow registrations.
        /// </summary>
        public bool RegistrationAllowed { get; set; }

        /// <summary>
        /// get/set - Whether to user email for username.
        /// </summary>
        public bool RegistrationEmailAsUsername { get; set; }

        /// <summary>
        /// get/set - Whether user's email has been verified.
        /// </summary>
        public bool VerifyEmail { get; set; }

        /// <summary>
        /// get/set - Whether user's can login with their email.
        /// </summary>
        public bool LoginWithEmailAllowed { get; set; }

        /// <summary>
        /// get/set - Whether duplicate emails are allowed.
        /// </summary>
        public bool DuplicateEmailsAllowed { get; set; }

        /// <summary>
        /// get/set - Whether user's can reset their password.
        /// </summary>
        public bool ResetPasswordAllowed { get; set; }

        /// <summary>
        /// get/set - Whether user's can edit their username.
        /// </summary>
        public bool EditUsernameAllowed { get; set; }

        /// <summary>
        /// get/set - An array of default roles.
        /// </summary>
        public string[] DefaultRoles { get; set; }

        /// <summary>
        /// get/set - An array of required credentials.
        /// </summary>
        public string[] RequiredCredentials { get; set; }

        /// <summary>
        /// get/set - Whether user managed access is allowed.
        /// </summary>
        public bool UserManagedAccessAllowed { get; set; }

        /// <summary>
        /// get/set - A dictionary of attributes.
        /// </summary>
        public Dictionary<string, string> Attributes { get; set; }
        #endregion
    }
}
