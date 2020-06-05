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
        /// Create a new instance of a Province.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        public static Entity.Province CreateProvince(string id, string name)
        {
            return new Entity.Province(id, name) { RowVersion = new byte[] { 12, 13, 14 } };
        }

        /// <summary>
        /// Creates a default list of Province.
        /// </summary>
        /// <returns></returns>
        public static List<Entity.Province> CreateDefaultProvinces()
        {
            return new List<Entity.Province>()
            {
                new Entity.Province("ON", "Ontario") { RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.Province("BC", "British Columbia") { RowVersion = new byte[] { 12, 13, 14 } },
            };
        }
    }
}
