using Microsoft.AspNetCore.Authorization;

namespace Pims.Api.Helpers.Authorization
{
    /// <summary>
    /// RealmAccessRequirement class, provides a way to ensure a user has the specified role.
    /// </summary>
    public class RealmAccessRoleRequirement : IAuthorizationRequirement
    {
        #region Properties
        /// <summary>
        /// get - The role to validate.
        /// </summary>
        /// <value></value>
        public string Role { get; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a RealmAccessRoleRequirment class.
        /// </summary>
        /// <param name="role"></param>
        public RealmAccessRoleRequirement(string role)
        {
            this.Role = role;
        }
        #endregion
    }
}
