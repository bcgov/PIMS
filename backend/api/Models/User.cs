using System;

namespace Pims.Api.Models
{
    /// <summary>
    /// User class, provides a model for users.
    /// </summary>
    public class User
    {
        #region Properties
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a User class.
        /// </summary>
        public User() { }

        /// <summary>
        /// Creates a new instance of a User class.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="username"></param>
        /// <param name="email"></param>
        /// <param name="firstName"></param>
        /// <param name="lastName"></param>
        public User(Guid id, string username, string email, string firstName, string lastName)
        {
            this.Id = id;
            this.Username = username;
            this.Email = email;
            this.FirstName = firstName;
            this.LastName = lastName;
        }

        /// <summary>
        /// Creates a new instance of a User class.
        /// </summary>
        /// <param name="user"></param>
        public User(Pims.Dal.Membership.Models.User user)
        {
            this.Id = user.id;
            this.Username = user.username;
            this.FirstName = user.firstName;
            this.LastName = user.lastName;
            this.Email = user.email;
        }
        #endregion
    }
}
