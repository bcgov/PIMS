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
        /// Create a new instance of a BuildingPredominateUse.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        public static Entity.BuildingPredominateUse CreateBuildingPredominateUse(int id, string name)
        {
            return new Entity.BuildingPredominateUse(id, name) { RowVersion = new byte[] { 12, 13, 14 } };
        }

        /// <summary>
        /// Create a new instance of a BuildingPredominateUse.
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public static Entity.BuildingPredominateUse CreateBuildingPredominateUse(string name)
        {
            return new Entity.BuildingPredominateUse(1, name) { RowVersion = new byte[] { 12, 13, 14 } };
        }

        /// <summary>
        /// Creates a default list of BuildingPredominateUse.
        /// </summary>
        /// <returns></returns>
        public static List<Entity.BuildingPredominateUse> CreateBuildingPredominateUses()
        {
            return new List<Entity.BuildingPredominateUse>()
            {
                new Entity.BuildingPredominateUse(0, "Religious") { RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.BuildingPredominateUse(1, "Research & Development Facility") { RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.BuildingPredominateUse(2, "Residential Detached") { RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.BuildingPredominateUse(3, "Residential Multi") { RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.BuildingPredominateUse(4, "Senior Housing (Assisted Living / Skilled Nursing)") { RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.BuildingPredominateUse(5, "Shelters / Orphanages / Children’s Homes / Halfway Homes") { RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.BuildingPredominateUse(6, "Social Assistance Housing") { RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.BuildingPredominateUse(7, "Storage") { RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.BuildingPredominateUse(8, "Storage Vehicle") { RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.BuildingPredominateUse(9, "Trailer Office") { RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.BuildingPredominateUse(10, "Trailer Other") { RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.BuildingPredominateUse(11, "Training Center") { RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.BuildingPredominateUse(12, "Transportation (Airport / Rail / Bus station)") { RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.BuildingPredominateUse(13, "University / Collect") { RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.BuildingPredominateUse(14, "Warehouse") { RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.BuildingPredominateUse(15, "Weigh Station") { RowVersion = new byte[] { 12, 13, 14 } }
            };
        }
    }
}

