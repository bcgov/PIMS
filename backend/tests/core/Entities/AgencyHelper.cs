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
        /// Create a new instance of a Parcel.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="code"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        public static Entity.Agency CreateAgency(int id = 1, string code = "AG", string name = "Agency")
        {
            var agency = new Entity.Agency(code, name)
            {
                Id = id,
                RowVersion = new byte[] { 12, 13, 14 }
            };

            return agency;
        }

        /// <summary>
        /// Creates a default list of Agency.
        /// </summary>
        /// <returns></returns>
        public static List<Entity.Agency> CreateDefaultAgencies()
        {
            return new List<Entity.Agency>()
            {
                // Parent agencies
                new Entity.Agency("AEST", "Ministry of Advanced Education, Skills & Training") { Id = 1, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.Agency("CITZ", "Ministry of Citizens Service") { Id = 2, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.Agency("CSNR", "Ministry of Corporate Services for the Natural Resources Sector") { Id = 3, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.Agency("EDUC", "Ministry of Education") { Id = 4, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.Agency("FIN", "Ministry of Financ") { Id = 5, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.Agency("FLNR", "Ministry of Forests, Lands, Natural Resources") { Id = 6 },
                new Entity.Agency("HLTH", "Ministry of Health") { Id = 7, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.Agency("MAH", "Ministry of Municipal Affairs & Housing") { Id = 8, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.Agency("TRAN", "Ministry of Transportation and Infrastructure") { Id = 9, RowVersion = new byte[] { 12, 13, 14 } },

                // Sub-agencies
                new Entity.Agency("LEAD", "Ministry Lead") { Id = 10, ParentId = 7, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.Agency("ADM", "Acting Deputy Minister") { Id = 11, ParentId = 7, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.Agency("ED", "Executive Director") { Id = 12, ParentId = 7, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.Agency("FHA", "Fraser Health Authority") { Id = 13, ParentId = 7, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.Agency("IHA", "Interior Health Authority") { Id = 14, ParentId = 7, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.Agency("NHA", "Northern Health Authority") { Id = 15, ParentId = 7, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.Agency("PHSA", "Provincial Health Services Authority") { Id = 16, ParentId = 7, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.Agency("VCHA", "Vancouver Coastal Health Authority") { Id = 17, ParentId = 7, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.Agency("VIHA", "Vancouver Island Health Authority") { Id = 18, ParentId = 7, RowVersion = new byte[] { 12, 13, 14 } }
            };
        }
    }
}

