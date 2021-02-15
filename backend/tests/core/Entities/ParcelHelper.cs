using Pims.Dal;
using System;
using System.Collections.Generic;
using System.Linq;
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
        /// <param name="pid"></param>
        /// <param name="lat"></param>
        /// <param name="lng"></param>
        /// <param name="agencyId"></param>
        /// <returns></returns>
        public static Entity.Parcel CreateParcel(int pid, double lat = 0, double lng = 0, int agencyId = 1, Entity.Address address = null)
        {
            var agency = EntityHelper.CreateAgency(agencyId);
            return CreateParcel(pid, lat, lng, agency, address);
        }

        /// <summary>
        /// Create a new instance of a Parcel.
        /// </summary>
        /// <param name="pid"></param>
        /// <param name="lat"></param>
        /// <param name="lng"></param>
        /// <param name="agency"></param>
        /// <returns></returns>
        public static Entity.Parcel CreateParcel(int pid, double lat, double lng, Entity.Agency agency, Entity.Address address = null)
        {
            agency ??= EntityHelper.CreateAgency(pid);
            if (address == null)
            {
                address = EntityHelper.CreateAddress(pid, "1234 Street", null, "V9C9C9");
            }
            var classification = EntityHelper.CreatePropertyClassification("classification");

            return new Entity.Parcel(pid, lat, lng)
            {
                Id = pid,
                Agency = agency,
                AgencyId = agency.Id,
                Address = address,
                AddressId = address.Id,
                Classification = classification,
                ClassificationId = classification.Id,
                Description = $"description-{pid}",
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
                parcels.Add(CreateParcel(i, 0, 0, 1));
            }
            return parcels;
        }

        /// <summary>
        /// Create a new instance of a Parcel.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="pid"></param>
        /// <param name="agency"></param>
        /// <returns></returns>
        public static Entity.Parcel CreateParcel(this PimsContext context, int pid, Entity.Agency agency)
        {
            return context.CreateParcel(pid, 0, 0, agency);
        }

        /// <summary>
        /// Create a new instance of a Parcel.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="pid"></param>
        /// <param name="lat"></param>
        /// <param name="lng"></param>
        /// <param name="agency"></param>
        /// <returns></returns>
        public static Entity.Parcel CreateParcel(this PimsContext context, int pid, double lat = 0, double lng = 0, Entity.Agency agency = null)
        {
            agency ??= context.Agencies.FirstOrDefault() ?? EntityHelper.CreateAgency(pid);
            var address = context.CreateAddress(pid, "1234 Street", null, "V9C9C9");
            var classification = context.PropertyClassifications.FirstOrDefault(s => s.Id == 1) ?? EntityHelper.CreatePropertyClassification("classification");

            var parcel = new Entity.Parcel(pid, lat, lng)
            {
                Id = pid,
                Agency = agency,
                AgencyId = agency.Id,
                Address = address,
                AddressId = address.Id,
                Classification = classification,
                ClassificationId = classification.Id,
                Description = $"description-{pid}",
                CreatedById = Guid.NewGuid(),
                CreatedOn = DateTime.UtcNow,
                UpdatedById = Guid.NewGuid(),
                UpdatedOn = DateTime.UtcNow,
                RowVersion = new byte[] { 12, 13, 14 }
            };
            context.Parcels.Add(parcel);
            return parcel;
        }

        /// <summary>
        /// Create a new List with new instances of Parcels.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="startId"></param>
        /// <param name="count"></param>
        /// <returns></returns>
        public static List<Entity.Parcel> CreateParcels(this PimsContext context, int startId, int count)
        {
            var agency = context.Agencies.FirstOrDefault(a => a.Id == 1) ?? EntityHelper.CreateAgency(startId);

            var parcels = new List<Entity.Parcel>(count);
            for (var i = startId; i < (startId + count); i++)
            {
                parcels.Add(context.CreateParcel(i, 0, 0, agency));
            }
            return parcels;
        }
    }
}
