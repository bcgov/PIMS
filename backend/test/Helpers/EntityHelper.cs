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
        public static Entity.Parcel CreateParcel(int pid, double lat = 0, double lng = 0, int agencyId = 1)
        {
            var agency = new Entity.Agency("AGENCY", "Test Agency")
            {
                Id = agencyId,
                RowVersion = new byte[] { 12, 13, 14 }
            };

            var city = new Entity.City("VIC", "Victoria") { Id = 1 };
            var province = new Entity.Province("BC", "British Columbia");
            var address = new Entity.Address("1234 Street", null, city.Id, province.Id, "V9C0E4") { Id = pid, City = city, Province = province };

            return new Entity.Parcel(lat, lng)
            {
                Id = pid,
                PID = pid,
                AgencyId = agency.Id,
                Agency = agency,
                AddressId = address.Id,
                Address = address,
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

        /// <summary>
        /// Creates a new instance of a Building.
        /// </summary>
        /// <param name="parcel"></param>
        /// <param name="id"></param>
        /// <param name="localId"></param>
        /// <param name="lat"></param>
        /// <param name="lng"></param>
        /// <param name="agencyId"></param>
        /// <returns></returns>
        public static Entity.Building CreateBuilding(Entity.Parcel parcel, int id, string localId, int lat = 0, int lng = 0, int agencyId = 1)
        {
            var agency = new Entity.Agency("AGENCY", "Test Agency")
            {
                Id = agencyId,
                RowVersion = new byte[] { 12, 13, 14 }
            };

            var city = new Entity.City("VIC", "Victoria") { Id = 1 };
            var province = new Entity.Province("BC", "British Columbia");
            var address = new Entity.Address("1234 Street", null, city.Id, province.Id, "V9C0E4") { Id = id, City = city, Province = province };

            return new Entity.Building(lat, lng)
            {
                Id = id,
                Parcel = parcel,
                ParcelId = parcel.Id,
                LocalId = localId,
                AgencyId = agency.Id,
                Agency = agency,
                AddressId = address.Id,
                Address = address,
                CreatedById = Guid.NewGuid(),
                CreatedOn = DateTime.UtcNow,
                UpdatedById = Guid.NewGuid(),
                UpdatedOn = DateTime.UtcNow,
                RowVersion = new byte[] { 12, 13, 14 }
            };
        }
    }
}
