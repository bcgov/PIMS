using Mapster;
using Microsoft.Extensions.Options;
using Pims.Dal.Entities;
using Pims.Dal.Entities.Helpers.Extensions;
using Pims.Dal.Helpers.Extensions;
using Pims.Core.Extensions;
using System;
using System.Collections.Generic;
using System.Text.Json;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Property.Models.Search;

namespace Pims.Api.Areas.Property.Mapping.Search
{
    public class PropertyMap : IRegister
    {
        #region Variables
        private readonly JsonSerializerOptions _serializerOptions;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ProjectMap, initializes with specified arguments.
        /// </summary>
        /// <param name="serializerOptions"></param>
        public PropertyMap(IOptions<JsonSerializerOptions> serializerOptions)
        {
            _serializerOptions = serializerOptions.Value;
        }
        #endregion

        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Property, Model.PropertyModel>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.PropertyTypeId, src => src.PropertyTypeId)
                .Map(dest => dest.ClassificationId, src => src.ClassificationId)
                .Map(dest => dest.Classification, src => src.Classification == null ? null : src.Classification.Name)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.ProjectNumbers, src => JsonSerializer.Deserialize<IEnumerable<string>>(src.ProjectNumbers ?? "[]", _serializerOptions))
                .Map(dest => dest.IsSensitive, src => src.IsSensitive)

                .Map(dest => dest.AgencyId, src => src.AgencyId)
                .Map(dest => dest.Agency, src => src.Agency == null ? null : src.Agency.ParentId.HasValue ? src.Agency.Parent.Name : src.Agency.Name)
                .Map(dest => dest.AgencyCode, src => src.Agency == null ? null : src.Agency.ParentId.HasValue ? src.Agency.Parent.Code : src.Agency.Code)
                .Map(dest => dest.SubAgency, src => src.Agency == null ? null : src.Agency.ParentId.HasValue ? null : src.Agency.Name)
                .Map(dest => dest.SubAgencyCode, src => src.Agency == null ? null : src.Agency.ParentId.HasValue ? null : src.Agency.Code)

                .Map(dest => dest.Latitude, src => src.Location.Y)
                .Map(dest => dest.Longitude, src => src.Location.X)
                .Map(dest => dest.AddressId, src => src.AddressId)
                .Map(dest => dest.Address, src => src.Address == null ? null : $"{src.Address.Address1} {src.Address.Address2}".Trim())
                .Map(dest => dest.Province, src => src.Address == null || src.Address.Province == null ? null : src.Address.Province.Name)
                .Map(dest => dest.AdministrativeArea, src => src.Address == null ? null : src.Address.AdministrativeArea)
                .Map(dest => dest.Postal, src => src.Address == null ? null : src.Address.Postal);

            config.NewConfig<Entity.Parcel, Model.PropertyModel>()
                .Inherits<Entity.Property, Model.PropertyModel>()
                .Map(dest => dest.PropertyTypeId, src => src.PropertyTypeId)
                .Map(dest => dest.PID, src => src.ParcelIdentity)
                .Map(dest => dest.PIN, src => src.PIN)

                .Map(dest => dest.LandArea, src => src.LandArea)
                .Map(dest => dest.LandLegalDescription, src => src.LandLegalDescription)
                .Map(dest => dest.Zoning, src => src.Zoning)
                .Map(dest => dest.ZoningPotential, src => src.ZoningPotential)

                .Map(dest => dest.Market, src => src.GetCurrentFiscal(FiscalKeys.Market))
                .Map(dest => dest.MarketFiscalYear, src => src.GetCurrentFiscalYear(FiscalKeys.Market))
                .Map(dest => dest.NetBook, src => src.GetCurrentFiscal(FiscalKeys.NetBook))
                .Map(dest => dest.NetBookFiscalYear, src => src.GetCurrentFiscalYear(FiscalKeys.NetBook))
                // TODO: Fix assessment values.
                .Map(dest => dest.AssessedLand, src => src.GetCurrentEvaluation(EvaluationKeys.Assessed))
                .Map(dest => dest.AssessedLandDate, src => src.GetCurrentEvaluationDate(EvaluationKeys.Assessed))
                .Map(dest => dest.AssessedBuilding, src => src.GetCurrentEvaluation(EvaluationKeys.Improvements))
                .Map(dest => dest.AssessedBuildingDate, src => src.GetCurrentEvaluationDate(EvaluationKeys.Improvements));

            config.NewConfig<Entity.Building, Model.PropertyModel>()
                .Inherits<Entity.Property, Model.PropertyModel>()
                .Map(dest => dest.PropertyTypeId, src => src.PropertyTypeId)
                .Map(dest => dest.ConstructionTypeId, src => src.BuildingConstructionTypeId)
                .Map(dest => dest.ConstructionType, src => src.GetConstructionType())
                .Map(dest => dest.PredominateUseId, src => src.BuildingPredominateUseId)
                .Map(dest => dest.PredominateUse, src => src.GetPredominateUse())
                .Map(dest => dest.OccupantTypeId, src => src.BuildingOccupantTypeId)
                .Map(dest => dest.OccupantType, src => src.GetOccupantType())
                .Map(dest => dest.OccupantName, src => src.OccupantName)
                .Map(dest => dest.FloorCount, src => src.BuildingFloorCount)
                .Map(dest => dest.Tenancy, src => src.BuildingTenancy)
                .Map(dest => dest.TransferLeaseOnSale, src => src.TransferLeaseOnSale)
                .Map(dest => dest.LeaseExpiry, src => src.LeaseExpiry)
                .Map(dest => dest.RentableArea, src => src.RentableArea)

                .Map(dest => dest.PID, src => src.GetParcelIdentity())
                .Map(dest => dest.PIN, src => src.GetPIN())

                .Map(dest => dest.Market, src => src.GetCurrentFiscal(FiscalKeys.Market))
                .Map(dest => dest.MarketFiscalYear, src => src.GetCurrentFiscalYear(FiscalKeys.Market))
                .Map(dest => dest.NetBook, src => src.GetCurrentFiscal(FiscalKeys.NetBook))
                .Map(dest => dest.NetBookFiscalYear, src => src.GetCurrentFiscalYear(FiscalKeys.NetBook))
                .Map(dest => dest.AssessedBuilding, src => src.GetCurrentEvaluation(EvaluationKeys.Assessed))
                .Map(dest => dest.AssessedBuildingDate, src => src.GetCurrentEvaluationDate(EvaluationKeys.Assessed));

            config.NewConfig<Entity.Views.Property, Model.PropertyModel>()
                .Map(dest => dest.PropertyTypeId, src => src.PropertyTypeId)
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.RowVersion, src => src.RowVersion == null ? null : Convert.ToBase64String(src.RowVersion))
                .Map(dest => dest.ClassificationId, src => src.ClassificationId)
                .Map(dest => dest.Classification, src => src.Classification)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.Latitude, src => src.Location.Y)
                .Map(dest => dest.Longitude, src => src.Location.X)
                .Map(dest => dest.ProjectNumbers, src => JsonSerializer.Deserialize<IEnumerable<string>>(src.ProjectNumbers ?? "[]", _serializerOptions))
                .Map(dest => dest.IsSensitive, src => src.IsSensitive)

                .Map(dest => dest.AgencyId, src => src.AgencyId)
                .Map(dest => dest.Agency, src => src.Agency)
                .Map(dest => dest.AgencyCode, src => src.AgencyCode)
                .Map(dest => dest.SubAgency, src => src.SubAgency)
                .Map(dest => dest.SubAgencyCode, src => src.SubAgencyCode)

                .Map(dest => dest.AddressId, src => src.AddressId)
                .Map(dest => dest.Address, src => src.Address)
                .Map(dest => dest.AdministrativeArea, src => src.AdministrativeArea)
                .Map(dest => dest.Province, src => src.Province)
                .Map(dest => dest.Postal, src => src.Postal)

                .Map(dest => dest.PID, src => src.ParcelIdentity)
                .Map(dest => dest.PIN, src => src.PIN)
                .Map(dest => dest.LandArea, src => src.LandArea)
                .Map(dest => dest.LandLegalDescription, src => src.LandLegalDescription)
                .Map(dest => dest.Zoning, src => src.Zoning)
                .Map(dest => dest.ZoningPotential, src => src.ZoningPotential)

                .Map(dest => dest.ConstructionTypeId, src => src.BuildingConstructionTypeId)
                .Map(dest => dest.ConstructionType, src => src.BuildingConstructionType)
                .Map(dest => dest.PredominateUseId, src => src.BuildingPredominateUseId)
                .Map(dest => dest.PredominateUse, src => src.BuildingPredominateUse)
                .Map(dest => dest.OccupantTypeId, src => src.BuildingOccupantTypeId)
                .Map(dest => dest.OccupantType, src => src.BuildingOccupantType)
                .Map(dest => dest.OccupantName, src => src.OccupantName)
                .Map(dest => dest.FloorCount, src => src.BuildingFloorCount)
                .Map(dest => dest.Tenancy, src => src.BuildingTenancy)
                .Map(dest => dest.TransferLeaseOnSale, src => src.TransferLeaseOnSale)
                .Map(dest => dest.LeaseExpiry, src => src.LeaseExpiry)
                .Map(dest => dest.RentableArea, src => src.RentableArea)

                .Map(dest => dest.Market, src => src.MarketFiscalYear == DateTime.Now.GetFiscalYear() ? src.Market : null)
                .Map(dest => dest.MarketFiscalYear, src => src.MarketFiscalYear == DateTime.Now.GetFiscalYear() ? src.MarketFiscalYear : null)
                .Map(dest => dest.NetBook, src => src.NetBookFiscalYear == DateTime.Now.GetFiscalYear() ? src.NetBook : null)
                .Map(dest => dest.NetBookFiscalYear, src => src.NetBookFiscalYear == DateTime.Now.GetFiscalYear() ? src.NetBookFiscalYear : null)

                .Map(dest => dest.AssessedLand, src => src.AssessedLandDate.HasValue && DateTime.Now.Year == src.AssessedLandDate.Value.Year ? src.AssessedLand : null)
                .Map(dest => dest.AssessedLandDate, src => src.AssessedLandDate.HasValue && DateTime.Now.Year == src.AssessedLandDate.Value.Year ? src.AssessedLandDate : null)
                .Map(dest => dest.AssessedBuilding, src => src.AssessedBuildingDate.HasValue && DateTime.Now.Year == src.AssessedBuildingDate.Value.Year ? src.AssessedBuilding : null)
                .Map(dest => dest.AssessedBuildingDate, src => src.AssessedBuildingDate.HasValue && DateTime.Now.Year == src.AssessedBuildingDate.Value.Year ? src.AssessedBuildingDate : null);

            config.NewConfig<Entity.Models.ProjectProperty, Model.PropertyModel>()
                .Map(dest => dest.PropertyTypeId, src => src.PropertyTypeId)
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.ClassificationId, src => src.ClassificationId)
                .Map(dest => dest.Classification, src => src.Classification)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.Latitude, src => src.Location.Y)
                .Map(dest => dest.Longitude, src => src.Location.X)
                .Map(dest => dest.ProjectNumbers, src => JsonSerializer.Deserialize<IEnumerable<string>>(src.ProjectNumbers ?? "[]", _serializerOptions))
                .Map(dest => dest.ProjectStatus, src => src.ProjectStatus)
                .Map(dest => dest.IsSensitive, src => src.IsSensitive)

                .Map(dest => dest.AgencyId, src => src.AgencyId)
                .Map(dest => dest.Agency, src => src.Agency)
                .Map(dest => dest.AgencyCode, src => src.AgencyCode)
                .Map(dest => dest.SubAgency, src => src.SubAgency)
                .Map(dest => dest.SubAgencyCode, src => src.SubAgencyCode)

                .Map(dest => dest.AddressId, src => src.AddressId)
                .Map(dest => dest.Address, src => src.Address)
                .Map(dest => dest.AdministrativeArea, src => src.AdministrativeArea)
                .Map(dest => dest.Province, src => src.Province)
                .Map(dest => dest.Postal, src => src.Postal)

                .Map(dest => dest.PID, src => src.ParcelIdentity)
                .Map(dest => dest.PIN, src => src.PIN)
                .Map(dest => dest.LandArea, src => src.LandArea)
                .Map(dest => dest.LandLegalDescription, src => src.LandLegalDescription)
                .Map(dest => dest.Zoning, src => src.Zoning)
                .Map(dest => dest.ZoningPotential, src => src.ZoningPotential)

                .Map(dest => dest.ConstructionTypeId, src => src.BuildingConstructionTypeId)
                .Map(dest => dest.ConstructionType, src => src.BuildingConstructionType)
                .Map(dest => dest.PredominateUseId, src => src.BuildingPredominateUseId)
                .Map(dest => dest.PredominateUse, src => src.BuildingPredominateUse)
                .Map(dest => dest.OccupantTypeId, src => src.BuildingOccupantTypeId)
                .Map(dest => dest.OccupantType, src => src.BuildingOccupantType)
                .Map(dest => dest.OccupantName, src => src.OccupantName)
                .Map(dest => dest.FloorCount, src => src.BuildingFloorCount)
                .Map(dest => dest.Tenancy, src => src.BuildingTenancy)
                .Map(dest => dest.TransferLeaseOnSale, src => src.TransferLeaseOnSale)
                .Map(dest => dest.LeaseExpiry, src => src.LeaseExpiry)
                .Map(dest => dest.RentableArea, src => src.RentableArea)

                .Map(dest => dest.Market, src => src.Market)
                .Map(dest => dest.MarketFiscalYear, src => src.MarketFiscalYear)
                .Map(dest => dest.NetBook, src => src.NetBook)
                .Map(dest => dest.NetBookFiscalYear, src => src.NetBookFiscalYear)

                .Map(dest => dest.AssessedLand, src => src.AssessedLand)
                .Map(dest => dest.AssessedLandDate, src => src.AssessedLandDate)
                .Map(dest => dest.AssessedBuilding, src => src.AssessedBuilding)
                .Map(dest => dest.AssessedBuildingDate, src => src.AssessedBuildingDate);
        }
    }
}
