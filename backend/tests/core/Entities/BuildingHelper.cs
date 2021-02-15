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
        /// Creates a new instance of a Building.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="projectNumber"></param>
        /// <param name="name"></param>
        /// <param name="lat"></param>
        /// <param name="lng"></param>
        /// <param name="agency"></param>
        public static Entity.Building CreateBuilding(int id, string projectNumber = null, string name = null, int lat = 0, int lng = 0, Entity.Agency agency = null)
        {
            return CreateBuilding(id, projectNumber, name, lat, lng, agency);
        }

        /// <summary>
        /// Creates a new instance of a Building.
        /// </summary>
        /// <param name="parcel"></param>
        /// <param name="id"></param>
        /// <param name="projectNumber"></param>
        /// <param name="name"></param>
        /// <param name="lat"></param>
        /// <param name="lng"></param>
        /// <param name="agency"></param>
        /// <returns></returns>
        public static Entity.Building CreateBuilding(Entity.Parcel parcel, int id, string projectNumber = null, string name = null, int lat = 0, int lng = 0, Entity.Agency agency = null)
        {
            projectNumber ??= $"p{id}";
            agency ??= parcel?.Agency ?? EntityHelper.CreateAgency(id);
            var address = parcel != null ? EntityHelper.CreateAddress(++parcel.AddressId, parcel.Address.Address1, parcel.Address.Address2, parcel.Address.AdministrativeArea, parcel.Address.Province, parcel.Address.Postal) :
                EntityHelper.CreateAddress(id, "1234 Street", null, "V9C9C9");
            var predominateUse = EntityHelper.CreateBuildingPredominateUse("use");
            var constructionType = EntityHelper.CreateBuildingConstructionType("type");
            var occupantType = EntityHelper.CreateBuildingOccupantType("occupant");
            var classification = EntityHelper.CreatePropertyClassification("classification");

            return new Entity.Building(parcel, lat, lng)
            {
                Id = id,
                ProjectNumbers = $"[\"{projectNumber}\"]",
                AgencyId = agency.Id,
                Agency = agency,
                Name = name,
                AddressId = address.Id,
                Address = address,
                Classification = classification,
                ClassificationId = classification.Id,
                Description = $"description-{id}",
                BuildingPredominateUse = predominateUse,
                BuildingPredominateUseId = predominateUse.Id,
                BuildingConstructionType = constructionType,
                BuildingConstructionTypeId = constructionType.Id,
                BuildingOccupantType = occupantType,
                BuildingOccupantTypeId = occupantType.Id,
                CreatedById = Guid.NewGuid(),
                CreatedOn = DateTime.UtcNow,
                UpdatedById = Guid.NewGuid(),
                UpdatedOn = DateTime.UtcNow,
                RowVersion = new byte[] { 12, 13, 14 },
                PropertyTypeId = 1,
            };
        }

        /// <summary>
        /// Create a new List with new instances of Buildings.
        /// Adds the buildings to the specified 'parcel'.
        /// </summary>
        /// <param name="parcel"></param>
        /// <param name="startId"></param>
        /// <param name="count"></param>
        /// <returns></returns>
        public static List<Entity.Building> CreateBuildings(Entity.Parcel parcel, int startId, int count)
        {
            for (var i = startId; i < (startId + count); i++)
            {
                var building = CreateBuilding(parcel, i);
                parcel.Buildings.Add(new Entity.ParcelBuilding(parcel, building));
            }
            return parcel.Buildings.Select(pb => pb.Building).ToList();
        }

        /// <summary>
        /// Creates a new instance of a Building.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="id"></param>
        /// <param name="name"></param>
        /// <param name="lat"></param>
        /// <param name="lng"></param>
        /// <param name="agency"></param>
        /// <returns></returns>
        public static Entity.Building CreateBuilding(this PimsContext context, int id, string projectNumber = null, string name = null, int lat = 0, int lng = 0, Entity.Agency agency = null)
        {
            return CreateBuilding(context, null, id, projectNumber, name, lat, lng, agency);
        }

        /// <summary>
        /// Creates a new instance of a Building.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="parcel"></param>
        /// <param name="id"></param>
        /// <param name="name"></param>
        /// <param name="lat"></param>
        /// <param name="lng"></param>
        /// <param name="agency"></param>
        /// <returns></returns>
        public static Entity.Building CreateBuilding(this PimsContext context, Entity.Parcel parcel, int id, string projectNumber = null, string name = null, int lat = 0, int lng = 0, Entity.Agency agency = null)
        {
            name ??= $"l{id}";
            agency ??= parcel?.Agency ?? context.Agencies.FirstOrDefault() ?? EntityHelper.CreateAgency(id);
            var address = (parcel == null ? EntityHelper.CreateAddress(context, id, "1234 Street", null, "V9C9C9") :
                EntityHelper.CreateAddress(id, parcel.Address.Address1, parcel.Address.Address2, parcel.Address.AdministrativeArea, parcel.Address.Province, parcel.Address.Postal));
            var predominateUse = context.BuildingPredominateUses.FirstOrDefault(b => b.Id == 1) ?? EntityHelper.CreateBuildingPredominateUse("use"); ;
            var constructionType = context.BuildingConstructionTypes.FirstOrDefault(b => b.Id == 1) ?? EntityHelper.CreateBuildingConstructionType("type");
            var occupantType = context.BuildingOccupantTypes.FirstOrDefault(b => b.Id == 1) ?? EntityHelper.CreateBuildingOccupantType("occupant");
            var classification = context.PropertyClassifications.FirstOrDefault(b => b.Id == 1) ?? EntityHelper.CreatePropertyClassification("classification");

            var building = new Entity.Building(parcel, lat, lng)
            {
                Id = id,
                Name = name,
                ProjectNumbers = projectNumber,
                AgencyId = agency.Id,
                Agency = agency,
                AddressId = address.Id,
                Address = address,
                Classification = classification,
                ClassificationId = classification.Id,
                Description = $"description-{id}",
                BuildingPredominateUse = predominateUse,
                BuildingPredominateUseId = predominateUse.Id,
                BuildingConstructionType = constructionType,
                BuildingConstructionTypeId = constructionType.Id,
                BuildingOccupantType = occupantType,
                BuildingOccupantTypeId = occupantType.Id,
                CreatedById = Guid.NewGuid(),
                CreatedOn = DateTime.UtcNow,
                UpdatedById = Guid.NewGuid(),
                UpdatedOn = DateTime.UtcNow,
                RowVersion = new byte[] { 12, 13, 14 }
            };
            if (parcel != null)
            {
                var parcelBuilding = new Entity.ParcelBuilding(parcel, building);
            }
            context.Buildings.Add(building);
            return building;
        }

        /// <summary>
        /// Create a new List with new instances of Buildings.
        /// Adds the buildings to the specified 'parcel'.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="parcel"></param>
        /// <param name="startId"></param>
        /// <param name="count"></param>
        /// <returns></returns>
        public static List<Entity.Building> CreateBuildings(this PimsContext context, Entity.Parcel parcel, int startId, int count)
        {
            for (var i = startId; i < (startId + count); i++)
            {
                context.CreateBuilding(parcel, i);
            }
            return parcel.Buildings.Select(pb => pb.Building).ToList();
        }
    }
}
