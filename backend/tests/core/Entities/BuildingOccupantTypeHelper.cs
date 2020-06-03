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
        /// Create a new instance of a BuildingOccupantType.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        public static Entity.BuildingOccupantType CreateBuildingOccupantType(int id, string name)
        {
            return new Entity.BuildingOccupantType(id, name) { RowVersion = new byte[] { 12, 13, 14 } };
        }

        /// <summary>
        /// Create a new instance of a BuildingOccupantType.
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public static Entity.BuildingOccupantType CreateBuildingOccupantType(string name)
        {
            return new Entity.BuildingOccupantType(1, name) { RowVersion = new byte[] { 12, 13, 14 } };
        }

        /// <summary>
        /// Creates a default list of BuildingOccupantType.
        /// </summary>
        /// <returns></returns>
        public static List<Entity.BuildingOccupantType> CreateDefaultBuildingOccupantTypes()
        {
            return new List<Entity.BuildingOccupantType>()
            {
                new Entity.BuildingOccupantType(0, "Leased") { RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.BuildingOccupantType(1, "Occupied By Owning Ministry") { RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.BuildingOccupantType(2, "Unoccupied") { RowVersion = new byte[] { 12, 13, 14 } }
            };
        }
    }
}
