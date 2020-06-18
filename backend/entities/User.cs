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
        /// get/set - The unique user name to identify the user.
        /// </summary>
        /// <value></value>
        public string Username { get; set; }

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
        /// get/set - The user's position title.
        /// </summary>
        /// <value></value>
        public string Position { get; set; }

        /// <summary>
        /// get/set - Whether the user is disabled.
        /// </summary>
        /// <value></value>
        public bool IsDisabled { get; set; }

        /// <summary>
        /// get/set - Whether their email has been verified.
        /// </summary>
        /// <value></value>
        public bool EmailVerified { get; set; }

        /// <summary>
        /// get/set - A note about the user.
        /// </summary>
        /// <value></value>
        public string Note { get; set; }

        /// <summary>
        /// get/set - Whether this user account is a system account.
        /// A system account will not be visible through user management.
        /// </summary>
        public bool IsSystem { get; set; }

        /// <summary>
        /// get/set - Last Login date time
        /// </summary>
        /// <value></value>
        public DateTime? LastLogin { get; set; }
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
        /// Create a new instance of a User class, initializes with specified arguments.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="userName"></param>
        /// <param name="email"></param>
        public User(Guid id, string userName, string email)
        {
            if (id == Guid.Empty) throw new ArgumentException("User id must be unique.", nameof(id));
            if (String.IsNullOrWhiteSpace(userName)) throw new ArgumentException("Argument cannot be null, whitespace or empty.", nameof(userName));
            if (String.IsNullOrWhiteSpace(email)) throw new ArgumentException("Argument cannot be null, whitespace or empty.", nameof(email));

            this.Id = id;
            this.Username = userName;
            this.Email = email;
        }

        /// <summary>
        /// Create a new instance of a User class, initializes with specified arguments.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="userName"></param>
        /// <param name="email"></param>
        /// <param name="firstName"></param>
        /// <param name="lastName"></param>
        public User(Guid id, string userName, string email, string firstName, string lastName) : this(id, userName, email)
        {
            this.FirstName = firstName;
            this.LastName = lastName;
            this.DisplayName = $"{lastName}, {firstName}";
        }
        #endregion
    }
}
