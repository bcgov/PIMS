using System;
using System.Collections.Generic;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Test.Helpers
{
    /// <summary>
    /// EntityHelper static class, provides helper methods to create test entities.
    /// </summary>
    public static class EntityHelper
    {
        /// <summary>
        /// Create a new instance of a Parcel.
        /// </summary>
        /// <param name="pid"></param>
        /// <param name="lat"></param>
        /// <param name="lng"></param>
        /// <param name="agencyId"></param>
        /// <returns></returns>
        public static Entity.Parcel CreateParcel(int pid, double lat, double lng, int agencyId)
        {
            var agency = new Entity.Agency("AGENCY", "Test Agency")
            {
                Id = agencyId,
                RowVersion = new byte[] { 12, 13, 14 }
            };

            return new Entity.Parcel(lat, lng)
            {
                Id = pid,
                PID = pid,
                AgencyId = agency.Id,
                Agency = agency,
                CreatedById = Guid.NewGuid(),
                CreatedOn = DateTime.UtcNow,
                UpdatedById = Guid.NewGuid(),
                UpdatedOn = DateTime.UtcNow,
                RowVersion = new byte[] { 12, 13, 14 }
            };
        }

        /// <summary>
        /// Create a new List with new instances of Parcels.
        /// </summary>
        /// <param name="startId"></param>
        /// <param name="count"></param>
        /// <returns></returns>
        public static List<Entity.Parcel> CreateParcels(int startId, int count)
        {
            var parcels = new List<Entity.Parcel>(count);
            for (var i = startId; i < (startId + count); i++)
            {
                parcels.Add(CreateParcel(startId, 0, 0, 1));
            }
            return parcels;
        }
    }
}
