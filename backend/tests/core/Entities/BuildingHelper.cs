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
        /// <param name="parcel"></param>
        /// <param name="id"></param>
        /// <param name="localId"></param>
        /// <param name="lat"></param>
        /// <param name="lng"></param>
        /// <param name="agency"></param>
        /// <returns></returns>
        public static Entity.Building CreateBuilding(Entity.Parcel parcel, int id, string projectNumber = null, string localId = null, int lat = 0, int lng = 0, Entity.Agency agency = null)
        {
            localId ??= $"l{id}";
            projectNumber ??= $"p{id}";
            agency ??= parcel.Agency;
            var address = EntityHelper.CreateAddress(++parcel.AddressId, parcel.Address.Address1, parcel.Address.Address2, parcel.Address.City, parcel.Address.Province, parcel.Address.Postal);
            var predominateUse = EntityHelper.CreateBuildingPredominateUse("use");
            var constructionType = EntityHelper.CreateBuildingConstructionType("type");
            var occupantType = EntityHelper.CreateBuildingOccupantType("occupant");
            var classification = EntityHelper.CreatePropertyClassification("classification");
            var status = EntityHelper.CreatePropertyStatus("status");

            return new Entity.Building(parcel, lat, lng)
            {
                Id = id,
                LocalId = localId,
                ProjectNumber = projectNumber,
                AgencyId = agency.Id,
                Agency = agency,
                AddressId = address.Id,
                Address = address,
                Classification = classification,
                ClassificationId = classification.Id,
                Description = $"description-{id}",
                Status = status,
                StatusId = status.Id,
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
                parcel.Buildings.Add(building);
            }
            return parcel.Buildings.ToList();
        }

        /// <summary>
        /// Creates a new instance of a Building.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="parcel"></param>
        /// <param name="id"></param>
        /// <param name="localId"></param>
        /// <param name="lat"></param>
        /// <param name="lng"></param>
        /// <param name="agency"></param>
        /// <returns></returns>
        public static Entity.Building CreateBuilding(this PimsContext context, Entity.Parcel parcel, int id, string projectNumber = null, string localId = null, int lat = 0, int lng = 0, Entity.Agency agency = null)
        {
            localId ??= $"l{id}";
            agency ??= parcel.Agency;
            var address = EntityHelper.CreateAddress(id, parcel.Address.Address1, parcel.Address.Address2, parcel.Address.City, parcel.Address.Province, parcel.Address.Postal);
            var predominateUse = context.BuildingPredominateUses.FirstOrDefault(b => b.Id == 1) ?? EntityHelper.CreateBuildingPredominateUse("use"); ;
            var constructionType = context.BuildingConstructionTypes.FirstOrDefault(b => b.Id == 1) ?? EntityHelper.CreateBuildingConstructionType("type");
            var occupantType = context.BuildingOccupantTypes.FirstOrDefault(b => b.Id == 1) ?? EntityHelper.CreateBuildingOccupantType("occupant");
            var classification = context.PropertyClassifications.FirstOrDefault(b => b.Id == 1) ?? EntityHelper.CreatePropertyClassification("classification");
            var status = context.PropertyStatus.FirstOrDefault(b => b.Id == 0) ?? EntityHelper.CreatePropertyStatus("status");

            var building = new Entity.Building(parcel, lat, lng)
            {
                Id = id,
                ProjectNumber = projectNumber,
                LocalId = localId,
                AgencyId = agency.Id,
                Agency = agency,
                AddressId = address.Id,
                Address = address,
                Classification = classification,
                ClassificationId = classification.Id,
                Description = $"description-{id}",
                Status = status,
                StatusId = status.Id,
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
            parcel.Buildings.Add(building);
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
            return parcel.Buildings.ToList();
        }

        /// <summary>
        /// Change the status of the building.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="building"></param>
        /// <param name="statusId"></param>
        /// <returns></returns>
        public static Entity.Building ChangeStatus(this PimsContext context, Entity.Building building, int statusId)
        {
            building.StatusId = statusId;
            building.Status = context.PropertyStatus.First(s => s.Id == statusId);
            return building;
        }

        /// <summary>
        /// Change the status of the building.
        /// </summary>
        /// <param name="building"></param>
        /// <param name="statusId"></param>
        /// <returns></returns>
        public static Entity.Building ChangeStatus(this Entity.Building building, Entity.PropertyStatus status)
        {
            building.Status = status;
            building.StatusId = status?.Id ?? throw new ArgumentNullException(nameof(status));
            return building;
        }
    }
}
