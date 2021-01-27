using Mapster;
using Pims.Api.Mapping.Converters;
using System.Collections.Generic;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Property.Models.Parcel;
using BModel = Pims.Api.Models;
using Pims.Dal.Helpers.Extensions;
using System.Text.Json;
using Microsoft.Extensions.Options;

namespace Pims.Api.Areas.Property.Mapping.Parcel
{
    public class ParcelBuildingMap : IRegister
    {
        #region Variables
        private readonly JsonSerializerOptions _serializerOptions;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a BuildingParcelMap, initializes with specified arguments.
        /// </summary>
        /// <param name="serializerOptions"></param>
        public ParcelBuildingMap(IOptions<JsonSerializerOptions> serializerOptions)
        {
            _serializerOptions = serializerOptions.Value;
        }
        #endregion

        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Building, Model.ParcelBuildingModel>()
                .EnableNonPublicMembers(true)
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.ParcelId, src => src.GetParcelId())
                .Map(dest => dest.ProjectNumbers, src => JsonSerializer.Deserialize<IEnumerable<string>>(src.ProjectNumbers ?? "[]", _serializerOptions))
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.AgencyId, src => src.AgencyId)
                .Map(dest => dest.Agency, src => AgencyConverter.ConvertAgency(src.Agency))
                .Map(dest => dest.SubAgency, src => AgencyConverter.ConvertSubAgency(src.Agency))
                .Map(dest => dest.Latitude, src => src.Location.Y)
                .Map(dest => dest.Longitude, src => src.Location.X)
                .Map(dest => dest.Address, src => src.Address)
                .Map(dest => dest.ClassificationId, src => src.ClassificationId)
                .Map(dest => dest.Classification, src => src.Classification.Name)
                .Map(dest => dest.BuildingConstructionTypeId, src => src.BuildingConstructionTypeId)
                .Map(dest => dest.BuildingConstructionType, src => src.GetConstructionType())
                .Map(dest => dest.BuildingOccupantTypeId, src => src.BuildingOccupantTypeId)
                .Map(dest => dest.BuildingOccupantType, src => src.GetOccupantType())
                .Map(dest => dest.BuildingPredominateUseId, src => src.BuildingPredominateUseId)
                .Map(dest => dest.BuildingPredominateUse, src => src.GetPredominateUse())
                .Map(dest => dest.BuildingTenancy, src => src.BuildingTenancy)
                .Map(dest => dest.BuildingFloorCount, src => src.BuildingFloorCount)
                .Map(dest => dest.LeaseExpiry, src => src.LeaseExpiry)
                .Map(dest => dest.OccupantName, src => src.OccupantName)
                .Map(dest => dest.RentableArea, src => src.RentableArea)
                .Map(dest => dest.IsSensitive, src => src.IsSensitive)
                .Map(dest => dest.IsVisibleToOtherAgencies, src => src.IsVisibleToOtherAgencies)
                .Map(dest => dest.Evaluations, src => src.Evaluations)
                .Map(dest => dest.Fiscals, src => src.Fiscals)
                .Inherits<Entity.BaseEntity, BModel.BaseModel>();

            config.NewConfig<Model.ParcelBuildingModel, Entity.Building>()
                .EnableNonPublicMembers(true)
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Parcels, src => new List<Entity.ParcelBuilding>() { new Entity.ParcelBuilding() { ParcelId = src.ParcelId, BuildingId = src.Id } }) // TODO: Extend Mapster to handle this better.
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.AgencyId, src => src.AgencyId)
                .Map(dest => dest.Location, src => src)
                .Map(dest => dest.AddressId, src => src.Address == null ? 0 : src.Address.Id)
                .Map(dest => dest.Address, src => src.Address)
                .Map(dest => dest.ClassificationId, src => src.ClassificationId)
                .Map(dest => dest.BuildingConstructionTypeId, src => src.BuildingConstructionTypeId)
                .Map(dest => dest.BuildingOccupantTypeId, src => src.BuildingOccupantTypeId)
                .Map(dest => dest.BuildingPredominateUseId, src => src.BuildingPredominateUseId)
                .Map(dest => dest.BuildingTenancy, src => src.BuildingTenancy)
                .Map(dest => dest.BuildingFloorCount, src => src.BuildingFloorCount)
                .Map(dest => dest.LeaseExpiry, src => src.LeaseExpiry)
                .Map(dest => dest.OccupantName, src => src.OccupantName)
                .Map(dest => dest.RentableArea, src => src.RentableArea)
                .Map(dest => dest.IsSensitive, src => src.IsSensitive)
                .Map(dest => dest.IsVisibleToOtherAgencies, src => src.IsVisibleToOtherAgencies)
                .Map(dest => dest.Evaluations, src => src.Evaluations)
                .Map(dest => dest.Fiscals, src => src.Fiscals)
                .Inherits<BModel.BaseModel, Entity.BaseEntity>();

            config.NewConfig<Entity.ParcelBuilding, Model.ParcelBuildingModel>()
                .EnableNonPublicMembers(true)
                .Map(dest => dest.Id, src => src.BuildingId)
                .Map(dest => dest.ParcelId, src => src.ParcelId)
                .Map(dest => dest.ProjectNumbers, src => JsonSerializer.Deserialize<IEnumerable<string>>(src.Building.ProjectNumbers ?? "[]", _serializerOptions))
                .Map(dest => dest.Name, src => src.Building.Name)
                .Map(dest => dest.Description, src => src.Building.Description)
                .Map(dest => dest.AgencyId, src => src.Building.AgencyId)
                .Map(dest => dest.Agency, src => AgencyConverter.ConvertAgency(src.Building.Agency))
                .Map(dest => dest.SubAgency, src => AgencyConverter.ConvertSubAgency(src.Building.Agency))
                .Map(dest => dest.Latitude, src => src.Building.Location.Y)
                .Map(dest => dest.Longitude, src => src.Building.Location.X)
                .Map(dest => dest.Address, src => src.Building.Address)
                .Map(dest => dest.ClassificationId, src => src.Building.ClassificationId)
                .Map(dest => dest.Classification, src => src.Building.Classification.Name)
                .Map(dest => dest.BuildingConstructionTypeId, src => src.Building.BuildingConstructionTypeId)
                .Map(dest => dest.BuildingConstructionType, src => src.Building.BuildingConstructionType == null ? null : src.Building.BuildingConstructionType.Name)
                .Map(dest => dest.BuildingOccupantTypeId, src => src.Building.BuildingOccupantTypeId)
                .Map(dest => dest.BuildingOccupantType, src => src.Building.BuildingOccupantType == null ? null : src.Building.BuildingOccupantType.Name)
                .Map(dest => dest.BuildingPredominateUseId, src => src.Building.BuildingPredominateUseId)
                .Map(dest => dest.BuildingPredominateUse, src => src.Building.BuildingPredominateUse == null ? null : src.Building.BuildingPredominateUse.Name)
                .Map(dest => dest.BuildingTenancy, src => src.Building.BuildingTenancy)
                .Map(dest => dest.BuildingFloorCount, src => src.Building.BuildingFloorCount)
                .Map(dest => dest.LeaseExpiry, src => src.Building.LeaseExpiry)
                .Map(dest => dest.OccupantName, src => src.Building.OccupantName)
                .Map(dest => dest.RentableArea, src => src.Building.RentableArea)
                .Map(dest => dest.IsSensitive, src => src.Building.IsSensitive)
                .Map(dest => dest.IsVisibleToOtherAgencies, src => src.Building.IsVisibleToOtherAgencies)
                .Map(dest => dest.Evaluations, src => src.Building.Evaluations)
                .Map(dest => dest.Fiscals, src => src.Building.Fiscals)
                .Inherits<Entity.BaseEntity, BModel.BaseModel>();

            config.NewConfig<Model.ParcelBuildingModel, Entity.ParcelBuilding>()
                .EnableNonPublicMembers(true)
                .Map(dest => dest.BuildingId, src => src.Id)
                .Map(dest => dest.ParcelId, src => src.ParcelId)
                .Map(dest => dest.Building.Id, src => src.Id)
                .Map(dest => dest.Building.Name, src => src.Name)
                .Map(dest => dest.Building.Description, src => src.Description)
                .Map(dest => dest.Building.AgencyId, src => src.AgencyId)
                .Map(dest => dest.Building.Location, src => src)
                .Map(dest => dest.Building.AddressId, src => src.Address == null ? 0 : src.Address.Id)
                .Map(dest => dest.Building.Address, src => src.Address)
                .Map(dest => dest.Building.ClassificationId, src => src.ClassificationId)
                .Map(dest => dest.Building.BuildingConstructionTypeId, src => src.BuildingConstructionTypeId)
                .Map(dest => dest.Building.BuildingOccupantTypeId, src => src.BuildingOccupantTypeId)
                .Map(dest => dest.Building.BuildingPredominateUseId, src => src.BuildingPredominateUseId)
                .Map(dest => dest.Building.BuildingTenancy, src => src.BuildingTenancy)
                .Map(dest => dest.Building.BuildingFloorCount, src => src.BuildingFloorCount)
                .Map(dest => dest.Building.LeaseExpiry, src => src.LeaseExpiry)
                .Map(dest => dest.Building.OccupantName, src => src.OccupantName)
                .Map(dest => dest.Building.RentableArea, src => src.RentableArea)
                .Map(dest => dest.Building.IsSensitive, src => src.IsSensitive)
                .Map(dest => dest.Building.IsVisibleToOtherAgencies, src => src.IsVisibleToOtherAgencies)
                .Map(dest => dest.Building.Evaluations, src => src.Evaluations)
                .Map(dest => dest.Building.Fiscals, src => src.Fiscals)
                .Inherits<BModel.BaseModel, Entity.BaseEntity>();

            config.NewConfig<Model.ParcelBuildingModel, NetTopologySuite.Geometries.Point>()
                .ConstructUsing(src => Dal.Helpers.GeometryHelper.CreatePoint(src.Longitude, src.Latitude));
        }
    }
}
