using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Reports.Models.Property;

namespace Pims.Api.Areas.Reports.Mapping.Property
{
    public class PropertyMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Views.Property, Model.PropertyModel>()
                .Map(dest => dest.Type, src => src.PropertyTypeId)
                .Map(dest => dest.Classification, src => src.Classification)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.Ministry, src => src.AgencyCode)
                .Map(dest => dest.Agency, src => src.SubAgency)
                .Map(dest => dest.Address, src => src.Address)
                .Map(dest => dest.AdministrativeArea, src => src.AdministrativeArea)
                .Map(dest => dest.Postal, src => src.Postal)
                .Map(dest => dest.Latitude, src => src.Location.Y)
                .Map(dest => dest.Longitude, src => src.Location.X)
                .Map(dest => dest.IsSensitive, src => src.IsSensitive)

                .Map(dest => dest.Market, src => src.Market)
                .Map(dest => dest.AssessedLand, src => src.AssessedLand)
                .Map(dest => dest.AssessedBuilding, src => src.AssessedBuilding)

                .Map(dest => dest.PID, src => src.ParcelIdentity)
                .Map(dest => dest.PIN, src => src.PIN)
                .Map(dest => dest.LandArea, src => src.LandArea)
                .Map(dest => dest.LandLegalDescription, src => src.LandLegalDescription)
                .Map(dest => dest.Zoning, src => src.Zoning)

                .Map(dest => dest.BuildingConstructionType, src => src.BuildingConstructionType)
                .Map(dest => dest.BuildingPredominateUse, src => src.BuildingPredominateUse)
                .Map(dest => dest.BuildingOccupantType, src => src.BuildingOccupantType)
                .Map(dest => dest.BuildingTenancy, src => src.BuildingTenancy)
                .Map(dest => dest.RentableArea, src => src.RentableArea)
                .Map(dest => dest.OccupantName, src => src.OccupantName)
                .Map(dest => dest.LeaseExpiry, src => src.LeaseExpiry)
                .Map(dest => dest.TransferLeaseOnSale, src => src.TransferLeaseOnSale);

        }
    }
}
