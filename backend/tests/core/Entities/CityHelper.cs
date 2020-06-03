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
        /// Create a new instance of a City.
        /// </summary>
        /// <param name="code"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        public static Entity.City CreateCity(string code, string name)
        {
            return new Entity.City(code, name)
            {
                Id = 1,
                RowVersion = new byte[] { 12, 13, 14 }
            };
        }

        /// <summary>
        /// Creates a default list of City.
        /// </summary>
        /// <returns></returns>
        public static List<Entity.City> CreateDefaultCities()
        {
            return new List<Entity.City>()
            {
                new Entity.City("ABB", "Abbotsford") { Id = 100, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.City("AGA", "Agassiz") { Id = 101, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.City("AHO", "Ahousaht") { Id = 102, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.City("ACA", "Albert Canyon") { Id = 103, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.City("VAN", "Vancouver") { Id = 104, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.City("VIC", "Victoria") { Id = 105, RowVersion = new byte[] { 12, 13, 14 } }
            };
        }
    }
}
