using System;
using System.Diagnostics.CodeAnalysis;
using Entity = Pims.Dal.Entities;

namespace Pims.Core.Test
{
    /// <summary>
    /// EntityHelper static class, provides helper methods to create test entities.
    /// </summary>
    [ExcludeFromCodeCoverage]
    public static partial class EntityHelper
    {
        /// <summary>
        /// Create a new instance of an AccessRequest for a default user.
        /// </summary>
        /// <returns></returns>
        public static Entity.AccessRequest CreateAccessRequest()
        {
            return CreateAccessRequest(1);
        }

        /// <summary>
        /// Create a new instance of an AccessRequest for a default user.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public static Entity.AccessRequest CreateAccessRequest(int id)
        {
            var user = EntityHelper.CreateUser("test");
            return CreateAccessRequest(id, user);
        }

        /// <summary>
        /// Create a new instance of an AccessRequest for the specified user.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        public static Entity.AccessRequest CreateAccessRequest(int id, Entity.User user)
        {
            var accessRequest = new Entity.AccessRequest()
            {
                Id = id,
                UserId = user.Id,
                User = user
            };

            accessRequest.Agencies.Add(new Entity.AccessRequestAgency()
            {
                AgencyId = 1,
                Agency = new Entity.Agency()
                {
                    Id = 1
                },
                AccessRequestId = id
            });

            var roleId = Guid.NewGuid();
            accessRequest.Roles.Add(new Entity.AccessRequestRole()
            {
                RoleId = roleId,
                Role = new Entity.Role()
                {
                    Id = roleId
                },
                AccessRequestId = id
            });

            return accessRequest;
        }
    }
}
