using System;

namespace Pims.Api.Membership.Models
{
    /// <summary>
    /// User class, provides a way to manage user information from the membership datasource.
    /// </summary>
    public class User
    {
        #region Properties
        public Guid id { get; set; }
        public string username { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string email { get; set; }
        #endregion
    }
}
