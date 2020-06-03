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
        /// Create a new instance of a TierLevel.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        public static Entity.TierLevel CreateTierLevel(int id, string name)
        {
            return new Entity.TierLevel(id, name) { RowVersion = new byte[] { 12, 13, 14 } };
        }

        /// <summary>
        /// Create a new instance of a TierLevel.
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public static Entity.TierLevel CreateTierLevel(string name)
        {
            return new Entity.TierLevel(1, name) { RowVersion = new byte[] { 12, 13, 14 } };
        }

        /// <summary>
        /// Creates a default list of TierLevel.
        /// </summary>
        /// <returns></returns>
        public static List<Entity.TierLevel> CreateDefaultTierLevels()
        {
            return new List<Entity.TierLevel>()
            {
                new Entity.TierLevel(1, "Tier 1") { RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.TierLevel(2, "Tier 2") { RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.TierLevel(3, "Tier 3") { RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.TierLevel(4, "Tier 4") { RowVersion = new byte[] { 12, 13, 14 } },
            };
        }
    }
}
