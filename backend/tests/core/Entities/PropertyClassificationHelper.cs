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
        /// Create a new instance of a PropertyClassification.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        public static Entity.PropertyClassification CreatePropertyClassification(int id, string name)
        {
            return new Entity.PropertyClassification(id, name) { RowVersion = new byte[] { 12, 13, 14 } };
        }

        /// <summary>
        /// Create a new instance of a PropertyClassification.
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public static Entity.PropertyClassification CreatePropertyClassification(string name)
        {
            return new Entity.PropertyClassification(1, name) { RowVersion = new byte[] { 12, 13, 14 } };
        }

        /// <summary>
        /// Creates a default list of PropertyClassification.
        /// </summary>
        /// <returns></returns>
        public static List<Entity.PropertyClassification> CreatePropertyClassifications()
        {
            return new List<Entity.PropertyClassification>()
            {
                new Entity.PropertyClassification(0, "Core Operational") { RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.PropertyClassification(1, "Core Strategic") { RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.PropertyClassification(2, "Surplus Active") { RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.PropertyClassification(3, "Surplus Encumbered") { RowVersion = new byte[] { 12, 13, 14 } }
            };
        }
    }
}
