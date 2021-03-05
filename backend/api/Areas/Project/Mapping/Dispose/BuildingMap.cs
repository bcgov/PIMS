using Mapster;
using Microsoft.Extensions.Options;
using Pims.Api.Models;
using Pims.Dal.Helpers.Extensions;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Project.Models.Dispose;

namespace Pims.Api.Areas.Project.Mapping.Dispose
{
    public class BuildingMap : IRegister
    {
        #region Variables
        private readonly JsonSerializerOptions _serializerOptions;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ProjectMap, initializes with specified arguments.
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
                .Map(dest => dest.ProjectNumbers, src => JsonSerializer.Deserialize<IEnumerable<string>>(src.ProjectNumbers ?? "[]", _serializerOptions))
                .Map(dest => dest.ClassificationId, src => src.ClassificationId)
                .Map(dest => dest.Classification, src => src.Classification.Name)
                .Map(dest => dest.AgencyId, src => src.AgencyId)
                .Map(dest => dest.Agency, src => src.Agency == null ? null : src.Agency.ParentId.HasValue ? src.Agency.Parent.Code : src.Agency.Code)
                .Map(dest => dest.SubAgency, src => src.Agency == null ? null : src.Agency.ParentId.HasValue ? src.Agency.Name : null)
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
                .Map(dest => dest.BuildingFloorCount, src => src.BuildingFloorCount)
                .Map(dest => dest.LeaseExpiry, src => src.LeaseExpiry)
                .Map(dest => dest.OccupantName, src => src.OccupantName)
                .Map(dest => dest.RentableArea, src => src.RentableArea)
                .Map(dest => dest.LandArea, src => src.Parcels.FirstOrDefault() != null ? src.Parcels.FirstOrDefault().Parcel.LandArea : 0)
                .Map(dest => dest.Zoning, src => src.Parcels.FirstOrDefault() != null ? src.Parcels.FirstOrDefault().Parcel.Zoning : "")
                .Map(dest => dest.ZoningPotential, src => src.Parcels.FirstOrDefault() != null ? src.Parcels.FirstOrDefault().Parcel.ZoningPotential : "")
                .Map(dest => dest.IsSensitive, src => src.IsSensitive)
                .Map(dest => dest.Evaluations, src => src.Evaluations)
                .Map(dest => dest.Fiscals, src => src.Fiscals)
                .Inherits<Entity.BaseEntity, BaseModel>();

            config.NewConfig<Model.BuildingModel, Entity.Building>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Parcels, src => new[] { new Entity.ParcelBuilding() { ParcelId = src.ParcelId, BuildingId = src.Id } })
                .Map(dest => dest.ProjectNumbers, src => JsonSerializer.Serialize<IEnumerable<string>>(src.ProjectNumbers ?? Enumerable.Empty<string>(), _serializerOptions))
                .Map(dest => dest.ClassificationId, src => src.ClassificationId)
                .Map(dest => dest.Classification, src => src.Classification)
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
                .Map(dest => dest.BuildingFloorCount, src => src.BuildingFloorCount)
                .Map(dest => dest.LeaseExpiry, src => src.LeaseExpiry)
                .Map(dest => dest.OccupantName, src => src.OccupantName)
                .Map(dest => dest.RentableArea, src => src.RentableArea)
                .Map(dest => dest.IsSensitive, src => src.IsSensitive)
                .Map(dest => dest.Evaluations, src => src.Evaluations)
                .Map(dest => dest.Fiscals, src => src.Fiscals)
                .AfterMapping((src, dest) =>
                {
                    var parcel = dest.Parcels.FirstOrDefault()?.Parcel;
                    if (parcel != null)
                    {
                        parcel.LandArea = src.LandArea;
                        parcel.Zoning = src.Zoning;
                        parcel.ZoningPotential = src.ZoningPotential;
                    }
                })
                .Inherits<BaseModel, Entity.BaseEntity>();

            config.NewConfig<Model.BuildingModel, NetTopologySuite.Geometries.Point>()
                .ConstructUsing(src => Dal.Helpers.GeometryHelper.CreatePoint(src.Longitude, src.Latitude));
        }
    }
}
