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
        /// Create a new instance of a BuildingConstructionType.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        public static Entity.BuildingConstructionType CreateBuildingConstructionType(int id, string name)
        {
            return new Entity.BuildingConstructionType(id, name) { RowVersion = new byte[] { 12, 13, 14 } };
        }

        /// <summary>
        /// Create a new instance of a BuildingConstructionType.
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public static Entity.BuildingConstructionType CreateBuildingConstructionType(string name)
        {
            return new Entity.BuildingConstructionType(1, name) { RowVersion = new byte[] { 12, 13, 14 } };
        }

        /// <summary>
        /// Creates a default list of BuildingConstructionType.
        /// </summary>
        /// <returns></returns>
        public static List<Entity.BuildingConstructionType> CreateDefaultBuildingConstructionTypes()
        {
            return new List<Entity.BuildingConstructionType>()
            {
                new Entity.BuildingConstructionType(0, "Concrete") { RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.BuildingConstructionType(1, "Masonry") { RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.BuildingConstructionType(2, "Mixed") { RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.BuildingConstructionType(3, "Steel") { RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.BuildingConstructionType(4, "Wood") { RowVersion = new byte[] { 12, 13, 14 } }
            };
        }
    }
}
