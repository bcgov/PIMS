using Mapster;
using Pims.Api.Mapping.Converters;
using Pims.Dal.Helpers.Extensions;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Admin.Models.Parcel;

namespace Pims.Api.Areas.Admin.Mapping.Parcel
{
    public class BuildingMap : IRegister
    {

        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Building, Model.BuildingModel>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.AgencyId, src => src.AgencyId)
                .Map(dest => dest.Agency, src => AgencyConverter.ConvertAgency(src.Agency))
                .Map(dest => dest.SubAgency, src => AgencyConverter.ConvertSubAgency(src.Agency))
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.ParcelId, src => src.GetParcelId())
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
                .Map(dest => dest.TotalArea, src => src.TotalArea)
                .Map(dest => dest.IsSensitive, src => src.IsSensitive)
                .Map(dest => dest.Evaluations, src => src.Evaluations)
                .Map(dest => dest.Fiscals, src => src.Fiscals)
                .Inherits<Entity.BaseEntity, Api.Models.BaseModel>();

            config.NewConfig<Model.BuildingModel, Entity.Building>()
                .IgnoreNonMapped(true)
                .Map(dest => dest.Id, src => src.Id)
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
                .Map(dest => dest.TotalArea, src => src.TotalArea)
                .Map(dest => dest.IsSensitive, src => src.IsSensitive)
                .Map(dest => dest.Evaluations, src => src.Evaluations)
                .Map(dest => dest.Fiscals, src => src.Fiscals)
                .Inherits<Api.Models.BaseModel, Entity.BaseEntity>();

            config.NewConfig<Model.BuildingModel, NetTopologySuite.Geometries.Point>()
                .ConstructUsing(src => Dal.Helpers.GeometryHelper.CreatePoint(src.Longitude, src.Latitude));
        }
    }
}
