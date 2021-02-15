using Mapster;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Reports.Models.AllPropertyFields;

namespace Pims.Api.Areas.Reports.Mapping.AllPropertyFields
{
    public class AllFieldsPropertyMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Views.Property, Model.AllFieldsPropertyModel>()
                .Map(dest => dest.Type, src => src.PropertyTypeId)
                .Map(dest => dest.ProjectNumbers, src => src.ProjectNumbers)
                .Map(dest => dest.Classification, src => src.Classification)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.Agency, src => src.Agency)
                .Map(dest => dest.AgencyCode, src => src.AgencyCode)
                .Map(dest => dest.SubAgency, src => src.SubAgency)
                .Map(dest => dest.SubAgencyCode, src => src.SubAgencyCode)
                .Map(dest => dest.Address, src => src.Address)
                .Map(dest => dest.Province, src => src.Province)
                .Map(dest => dest.AdministrativeArea, src => src.AdministrativeArea)
                .Map(dest => dest.Postal, src => src.Postal)
                .Map(dest => dest.Latitude, src => src.Location.Y)
                .Map(dest => dest.Longitude, src => src.Location.X)
                .Map(dest => dest.IsSensitive, src => src.IsSensitive)
                .Map(dest => dest.IsVisibleToOtherAgencies, src => src.IsVisibleToOtherAgencies)

                .Map(dest => dest.Market, src => src.Market)
                .Map(dest => dest.MarketFiscalYear, src => src.MarketFiscalYear)
                .Map(dest => dest.AssessedLand, src => src.AssessedLand)
                .Map(dest => dest.AssessedLandDate, src => src.AssessedLandDate)
                .Map(dest => dest.AssessedBuilding, src => src.AssessedBuilding)
                .Map(dest => dest.AssessedBuildingDate, src => src.AssessedBuildingDate)
                .Map(dest => dest.NetBook, src => src.NetBook)
                .Map(dest => dest.NetBookFiscalYear, src => src.NetBookFiscalYear)

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
