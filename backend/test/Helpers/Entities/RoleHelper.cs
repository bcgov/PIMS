using System;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Test.Helpers
{
    /// <summary>
    /// EntityHelper static class, provides helper methods to create test entities.
    /// </summary>
    public static partial class EntityHelper
    {
        /// <summary>
        /// Create a new instance of an AccessRequest for a default user.
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public static Entity.Role CreateRole(string name)
        {
            return CreateRole(Guid.NewGuid(), name);
        }

        /// <summary>
        /// Create a new instance of an AccessRequest for a default user.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        public static Entity.Role CreateRole(Guid id, string name)
        {
            return new Entity.Role(id, name)
            {
                RowVersion = new byte[] { 12, 13, 14 }
            };
        }
    }
}
