using Mapster;
using Pims.Api.Mapping.Converters;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Property.Models.Building;
using BModel = Pims.Api.Models;
using Pims.Dal.Helpers.Extensions;
using System.Text.Json;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Linq;

namespace Pims.Api.Areas.Property.Mapping.Building
{
    public class BuildingMap : IRegister
    {
        #region Variables
        private readonly JsonSerializerOptions _serializerOptions;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a BuildingMap, initializes with specified arguments.
        /// </summary>
        /// <param name="serializerOptions"></param>
        public BuildingMap(IOptions<JsonSerializerOptions> serializerOptions)
        {
            _serializerOptions = serializerOptions.Value;
        }
        #endregion

        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Building, Model.BuildingModel>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.ParcelId, src => src.GetParcelId())
                .Map(dest => dest.ProjectWorkflow, src => src.GetLatestWorkflowCode())
                .Map(dest => dest.ProjectStatus, src => src.GetLatestProjectStatus())
                .Map(dest => dest.ProjectNumbers, src => JsonSerializer.Deserialize<IEnumerable<string>>(src.ProjectNumbers ?? "[]", _serializerOptions))
                .Map(dest => dest.ClassificationId, src => src.ClassificationId)
                .Map(dest => dest.Classification, src => src.Classification.Name)
                .Map(dest => dest.EncumbranceReason, src => src.EncumbranceReason)
                .Map(dest => dest.AgencyId, src => src.AgencyId)
                .Map(dest => dest.Agency, src => AgencyConverter.ConvertAgency(src.Agency))
                .Map(dest => dest.SubAgency, src => AgencyConverter.ConvertSubAgency(src.Agency))
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.Latitude, src => src.Location.Y)
                .Map(dest => dest.Longitude, src => src.Location.X)
                .Map(dest => dest.Address, src => src.Address)
                .Map(dest => dest.BuildingConstructionTypeId, src => src.BuildingConstructionTypeId)
                .Map(dest => dest.BuildingConstructionType, src => src.GetConstructionType())
                .Map(dest => dest.BuildingOccupantTypeId, src => src.BuildingOccupantTypeId)
                .Map(dest => dest.BuildingOccupantType, src => src.GetOccupantType())
                .Map(dest => dest.BuildingPredominateUseId, src => src.BuildingPredominateUseId)
                .Map(dest => dest.BuildingPredominateUse, src => src.GetPredominateUse())
                .Map(dest => dest.BuildingTenancy, src => src.BuildingTenancy)
                .Map(dest => dest.BuildingTenancyUpdatedOn, src => src.BuildingTenancyUpdatedOn)
                .Map(dest => dest.BuildingFloorCount, src => src.BuildingFloorCount)
                .Map(dest => dest.LeaseExpiry, src => src.LeaseExpiry)
                .Map(dest => dest.OccupantName, src => src.OccupantName)
                .Map(dest => dest.RentableArea, src => src.RentableArea)
                .Map(dest => dest.TotalArea, src => src.TotalArea)
                .Map(dest => dest.IsSensitive, src => src.IsSensitive)
                .Map(dest => dest.Evaluations, src => src.Evaluations)
                .Map(dest => dest.Fiscals, src => src.Fiscals)
                .Map(dest => dest.Parcels, src => src.Parcels)
                .AfterMapping((src, dest) =>
                {
                    if (src.LeasedLandMetadata == null)
                    {
                        dest.LeasedLandMetadata = new List<Model.LeasedLandMetadataModel>();
                        return;
                    }
                    var metadata = JsonSerializer.Deserialize<IEnumerable<Entity.Models.LeasedLandMetadataModel>>(src.LeasedLandMetadata, _serializerOptions);

                    dest.LeasedLandMetadata = metadata.Where(m => m != null).Select(l => new Model.LeasedLandMetadataModel { OwnershipNote = l.OwnershipNote, ParcelId = l.ParcelId, Type = (int)l.Type });
                })
                .Inherits<Entity.BaseEntity, BModel.BaseModel>();

            config.NewConfig<Model.BuildingModel, Entity.Building>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Parcels, src => src.Parcels)
                .Map(dest => dest.ProjectNumbers, src => JsonSerializer.Serialize<IEnumerable<string>>(src.ProjectNumbers ?? Enumerable.Empty<string>(), _serializerOptions))
                .Map(dest => dest.ClassificationId, src => src.ClassificationId)
                .Map(dest => dest.EncumbranceReason, src => src.EncumbranceReason)
                .Map(dest => dest.AgencyId, src => src.AgencyId)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.Location, src => src)
                .Map(dest => dest.AddressId, src => src.Address == null ? 0 : src.Address.Id)
                .Map(dest => dest.Address, src => src.Address)
                .Map(dest => dest.BuildingConstructionTypeId, src => src.BuildingConstructionTypeId)
                .Map(dest => dest.BuildingOccupantTypeId, src => src.BuildingOccupantTypeId)
                .Map(dest => dest.BuildingPredominateUseId, src => src.BuildingPredominateUseId)
                .Map(dest => dest.BuildingTenancy, src => src.BuildingTenancy)
                .Map(dest => dest.BuildingTenancyUpdatedOn, src => src.BuildingTenancyUpdatedOn)
                .Map(dest => dest.BuildingFloorCount, src => src.BuildingFloorCount)
                .Map(dest => dest.LeaseExpiry, src => src.LeaseExpiry)
                .Map(dest => dest.OccupantName, src => src.OccupantName)
                .Map(dest => dest.RentableArea, src => src.RentableArea)
                .Map(dest => dest.TotalArea, src => src.TotalArea)
                .Map(dest => dest.IsSensitive, src => src.IsSensitive)
                .Map(dest => dest.Evaluations, src => src.Evaluations)
                .Map(dest => dest.Fiscals, src => src.Fiscals)
                .AfterMapping((src, dest) =>
                {
                    var metadata = JsonSerializer.Serialize<IEnumerable<Model.LeasedLandMetadataModel>>(src.LeasedLandMetadata, _serializerOptions);

                    dest.LeasedLandMetadata = metadata;
                })
                .Inherits<BModel.BaseModel, Entity.BaseEntity>();

            config.NewConfig<Model.BuildingModel, NetTopologySuite.Geometries.Point>()
                .ConstructUsing(src => Dal.Helpers.GeometryHelper.CreatePoint(src.Longitude, src.Latitude));
        }
    }
}
