using System;

namespace Pims.Dal.Membership
{
    /// <summary>
    /// ApplicationUser class, provides a way to manage application users.
    /// </summary>
    public class ApplicationUser
    {
        #region Properties
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        #endregion

        #region Constructors
        public ApplicationUser() { }

        public ApplicationUser(Guid id, string firstName, string lastName)
        {
            this.Id = id;
            this.FirstName = firstName;
            this.LastName = lastName;
        }
        #endregion
    }
}
