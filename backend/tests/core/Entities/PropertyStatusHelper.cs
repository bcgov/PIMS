using System.Collections.Generic;
using Entity = Pims.Dal.Entities;

namespace Pims.Core.Test
{
    /// <summary>
    /// EntityHelper static class, provides helper methods to create test entities.
    /// </summary>
    public static partial class EntityHelper
    {
        /// <summary>
        /// Create a new instance of a PropertyStatus.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        public static Entity.PropertyStatus CreatePropertyStatus(int id, string name)
        {
            return new Entity.PropertyStatus(id, name) { RowVersion = new byte[] { 12, 13, 14 } };
        }

        /// <summary>
        /// Create a new instance of a PropertyStatus.
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public static Entity.PropertyStatus CreatePropertyStatus(string name)
        {
            return new Entity.PropertyStatus(1, name) { RowVersion = new byte[] { 12, 13, 14 } };
        }

        /// <summary>
        /// Creates a default list of PropertyStatus.
        /// </summary>
        /// <returns></returns>
        public static List<Entity.PropertyStatus> CreateDefaultPropertyStatuses()
        {
            return new List<Entity.PropertyStatus>()
            {
                new Entity.PropertyStatus(0, "Disposed") { RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.PropertyStatus(1, "Active") { RowVersion = new byte[] { 12, 13, 14 } }
            };
        }
    }
}
