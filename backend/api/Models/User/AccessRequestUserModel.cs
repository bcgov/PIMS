using System;

namespace Pims.Api.Models.User
{
    /// <summary>
    /// AccessRequestUserModel class, provides a model that represents a user attached to an access request.
    /// </summary>
    public class AccessRequestUserModel : BaseModel
    {
        #region Properties
        /// <summary>
        /// get/set - The user's unique identifier.
        /// </summary>
        /// <value></value>
        public Guid Id { get; set; }

        /// <summary>
        /// get/set - The user's unique username.
        /// </summary>
        /// <value></value>
        public string Username { get; set; }

        /// <summary>
        /// get/set - The user's display name.
        /// </summary>
        /// <value></value>
        public string DisplayName { get; set; }

        /// <summary>
        /// get/set - The user's given name.
        /// </summary>
        /// <value></value>
        public string FirstName { get; set; }

        /// <summary>
        /// get/set - The user's middlename.
        /// </summary>
        /// <value></value>
        public string MiddleName { get; set; }

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
        /// get/set - The user's position title.
        /// </summary>
        /// <value></value>
        public string Position { get; set; }
        #endregion
    }
}
