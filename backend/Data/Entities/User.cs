using System;

namespace Pims.Api.Data.Entities
{
    /// <summary>
    /// User class, provides an entity for the datamodel to manage users.
    /// </summary>
    public class User : BaseEntity
    {
        #region Properties
        /// <summary>
        /// get/set - The primary key IDENTITY.
        /// </summary>
        /// <value></value>
        public Guid Id { get; set; }

        /// <summary>
        /// get/set - The users display name.
        /// </summary>
        /// <value></value>
        public string DisplayName { get; set; }

        /// <summary>
        /// get/set - The users first name.
        /// </summary>
        /// <value></value>
        public string FirstName { get; set; }

        /// <summary>
        /// get/set - The users middle name.
        /// </summary>
        /// <value></value>
        public string MiddleName { get; set; }

        /// <summary>
        /// get/set - The users last name.
        /// </summary>
        /// <value></value>
        public string LastName { get; set; }

        /// <summary>
        /// get/set - The users email address.
        /// </summary>
        /// <value></value>
        public string Email { get; set; }

        /// <summary>
        /// get/set - Whether the user is disabled.
        /// </summary>
        /// <value></value>
        public bool IsDisabled { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a User class.
        /// </summary>
        public User () { }

        /// <summary>
        /// Create a new instance of a User class.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="displayName"></param>
        public User (Guid id, string displayName)
        {
            this.Id = id;
            this.DisplayName = displayName;
        }
        #endregion
    }
}
