using System;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Test.Helpers
{
    /// <summary>
    /// EntityHelper static class, provides helper methods to create test entities.
    /// </summary>
    public static partial class EntityHelper
    {
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
            var agency = EntityHelper.CreateAgency(agencyId);
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
