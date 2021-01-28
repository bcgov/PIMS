using Mapster;
using Microsoft.Extensions.Options;
using Pims.Api.Mapping.Converters;
using Pims.Dal.Helpers.Extensions;
using System.Collections.Generic;
using System.Text.Json;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Models.Parcel;

namespace Pims.Api.Mapping.Parcel
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
                .Inherits<Entity.BaseEntity, Models.BaseModel>();


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
                .Inherits<Models.BaseModel, Entity.BaseEntity>();

            config.NewConfig<Model.ParcelBuildingModel, NetTopologySuite.Geometries.Point>()
                .ConstructUsing(src => Dal.Helpers.GeometryHelper.CreatePoint(src.Longitude, src.Latitude));
        }
    }
}
