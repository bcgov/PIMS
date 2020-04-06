using System;
using Entity = Pims.Dal.Entities;

namespace Pims.Core.Test
{
    /// <summary>
    /// EntityHelper static class, provides helper methods to create test entities.
    /// </summary>
    public static partial class EntityHelper
    {
        /// <summary>
        /// Create a new instance of an AccessRequest for a default user.
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        public static Entity.User CreateUser(string username)
        {
            return CreateUser(Guid.NewGuid(), username);
        }

        /// <summary>
        /// Create a new instance of an AccessRequest for a default user.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="username"></param>
        /// <param name="firstName"></param>
        /// <param name="lastName"></param>
        /// <param name="role"></param>
        /// <param name="agency"></param>
        /// <returns></returns>
        public static Entity.User CreateUser(Guid id, string username, string firstName = "given name", string lastName = "surname", Entity.Role role = null, Entity.Agency agency = null)
        {
            var user = new Entity.User(id, username, $"{firstName}.{lastName}@email.com")
            {
                DisplayName = $"{lastName}, {firstName}",
                RowVersion = new byte[] { 12, 13, 14 }
            };

            user.Roles.Add(new Entity.UserRole(user, role ?? EntityHelper.CreateRole("Real Estate Manager")));
            user.Agencies.Add(new Entity.UserAgency(user, agency ?? EntityHelper.CreateAgency()));

            return user;
        }
    }
}
