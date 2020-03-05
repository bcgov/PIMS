using System;

namespace Pims.Api.Models.Membership
{
    /// <summary>
    /// ApplicationUserModel class, provides a way to manage application users.
    /// </summary>
    public class ApplicationUserModel
    {
        #region Properties
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        #endregion

        #region Constructors
        public ApplicationUserModel() { }

        public ApplicationUserModel(Guid id, string firstName, string lastName)
        {
            this.Id = id;
            this.FirstName = firstName;
            this.LastName = lastName;
        }
        #endregion
    }
}
