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
        public Guid Id { get; set; }

        /// <summary>
        /// get/set - The unique user name to identify the user.
        /// </summary>
        public string Username { get; set; }

        /// <summary>
        /// get/set - The users display name.
        /// </summary>
        public string DisplayName { get; set; }

        /// <summary>
        /// get/set - The users first name.
        /// </summary>
        public string FirstName { get; set; }

        /// <summary>
        /// get/set - The users middle name.
        /// </summary>
        public string MiddleName { get; set; }

        /// <summary>
        /// get/set - The users last name.
        /// </summary>
        public string LastName { get; set; }

        /// <summary>
        /// get/set - The users email address.
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// get/set - The user's position title.
        /// </summary>
        public string Position { get; set; }

        /// <summary>
        /// get/set - Whether the user is disabled.
        /// </summary>
        public bool IsDisabled { get; set; }

        /// <summary>
        /// get/set - Whether their email has been verified.
        /// </summary>
        public bool EmailVerified { get; set; }

        /// <summary>
        /// get/set - A note about the user.
        /// </summary>
        public string Note { get; set; }

        /// <summary>
        /// get/set - Whether this user account is a system account.
        /// A system account will not be visible through user management.
        /// </summary>
        public bool IsSystem { get; set; }

        /// <summary>
        /// get/set - Last Login date time
        /// </summary>
        public DateTime? LastLogin { get; set; }

        /// <summary>
        /// get/set - Foreign key to the user who approved this user.
        /// </summary>
        public Guid? ApprovedById { get; set; }

        /// <summary>
        /// get/set - The user who approved this user.
        /// </summary>
        public User ApprovedBy { get; set; }

        /// <summary>
        /// get/set - When the user was approved.
        /// </summary>
        public DateTime? ApprovedOn { get; set; }

        /// <summary>
        /// get - A collection of agencies this user belongs to.
        /// </summary>
        /// <typeparam name="UserAgency"></typeparam>
        public ICollection<UserAgency> Agencies { get; } = new List<UserAgency>();

        /// <summary>
        /// get - A collection of roles this user belongs to.
        /// </summary>
        /// <typeparam name="Role"></typeparam>
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
