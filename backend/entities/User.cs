using System;
using System.Collections.Generic;

namespace Pims.Dal.Entities
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

        /// <summary>
        /// get - A collection of agencies this user belongs to.
        /// </summary>
        /// <typeparam name="UserAgency"></typeparam>
        /// <returns></returns>
        public ICollection<UserAgency> Agencies { get; } = new List<UserAgency>();

        /// <summary>
        /// get - A collection of roles this user belongs to.
        /// </summary>
        /// <typeparam name="Role"></typeparam>
        /// <returns></returns>
        public ICollection<UserRole> Roles { get; } = new List<UserRole>();
        #endregion

        #region Constructors
        /// <summary>
        /// Create a new instance of a User class.
        /// </summary>
        public User() { }

        /// <summary>
        /// Create a new instance of a User class.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="displayName"></param>
        /// <param name="email"></param>
        public User(Guid id, string displayName, string email)
        {
            if (id == Guid.Empty) throw new ArgumentException("User id must be unique.", nameof(id));
            if (String.IsNullOrWhiteSpace(displayName)) throw new ArgumentException("Display name must be provided.", nameof(displayName));
            if (String.IsNullOrWhiteSpace(email)) throw new ArgumentException("Email must be provided.", nameof(email));

            this.Id = id;
            this.DisplayName = displayName;
            this.Email = email;
        }
        #endregion
    }
}
