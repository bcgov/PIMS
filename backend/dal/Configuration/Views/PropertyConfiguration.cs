using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;
using System.Linq;
using System;

namespace Pims.Dal.Configuration.Views
{
    /// <summary>
    /// PropertyConfiguration class, provides a way to configure the properties view in the database.
    ///</summary>
    public class PropertyConfiguration : IEntityTypeConfiguration<Entities.Views.Property>
    {
        #region Properties
        public PimsContext Context { get; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a PropertyConfiguration object, initializes with specified parameters.
        /// </summary>
        /// <param name="context"></param>
        public PropertyConfiguration(PimsContext context)
        {
            this.Context = context;
        }
        #endregion

        #region Methods
        public virtual void Configure(EntityTypeBuilder<Entities.Views.Property> builder)
        {
            if (!this.Context.Database.IsInMemory())
            {
                builder.ToView("View_Properties");
                builder.HasNoKey();
            }
            else
            {
                // This is required to support unit-testing the view in the InMemory database.
                builder
                    .HasNoKey()
                    .ToQuery(() => (
                        from b in this.Context.Buildings
                        select new Entities.Views.Property()
                        {
                            Id = b.Id,
                            PropertyTypeId = PropertyTypes.Building,
                            ClassificationId = b.ClassificationId,
                            Classification = b.Classification.Name,
                            Name = b.Name,
                            Description = b.Description,
                            IsSensitive = b.IsSensitive,
                            IsVisibleToOtherAgencies = b.IsVisibleToOtherAgencies,
                            Location = b.Location,
                            Boundary = b.Boundary,

                            Address = $"{b.Address.Address1} {b.Address.Address2})".Trim(),
                            AdministrativeArea = b.Address.AdministrativeArea,
                            Province = b.Address.Province.Name,
                            Postal = b.Address.Postal,

                            AgencyId = b.AgencyId,
                            Agency = b.Agency.ParentId.HasValue ? b.Agency.Parent.Name : b.Agency.Name,
                            AgencyCode = b.Agency.ParentId.HasValue ? b.Agency.Parent.Code : b.Agency.Code,
                            SubAgency = b.Agency.ParentId.HasValue ? null : b.Agency.Name,
                            SubAgencyCode = b.Agency.ParentId.HasValue ? null : b.Agency.Code,

                            Market = b.Fiscals.Any(f => f.Key == FiscalKeys.Market) ? b.Fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == FiscalKeys.Market).Value : (decimal?)null,
                            MarketFiscalYear = b.Fiscals.Any(f => f.Key == FiscalKeys.Market) ? b.Fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == FiscalKeys.Market).FiscalYear : (int?)null,
                            NetBook = b.Fiscals.Any(f => f.Key == FiscalKeys.NetBook) ? b.Fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == FiscalKeys.NetBook).Value : (decimal?)null,
                            NetBookFiscalYear = b.Fiscals.Any(f => f.Key == FiscalKeys.NetBook) ? b.Fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == FiscalKeys.NetBook).FiscalYear : (int?)null,
                            AssessedLand = b.Evaluations.Any(f => f.Key == EvaluationKeys.Assessed) ? b.Evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == EvaluationKeys.Assessed).Value : (decimal?)null,
                            AssessedLandDate = b.Evaluations.Any(f => f.Key == EvaluationKeys.Assessed) ? b.Evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == EvaluationKeys.Assessed).Date : (DateTime?)null,
                            AssessedBuilding = b.Evaluations.Any(f => f.Key == EvaluationKeys.Improvements) ? b.Evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == EvaluationKeys.Improvements).Value : (decimal?)null,
                            AssessedBuildingDate = b.Evaluations.Any(f => f.Key == EvaluationKeys.Improvements) ? b.Evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == EvaluationKeys.Improvements).Date : (DateTime?)null,

                            RentableArea = b.RentableArea,
                            BuildingFloorCount = b.BuildingFloorCount,
                            BuildingConstructionTypeId = b.BuildingConstructionTypeId,
                            BuildingConstructionType = b.BuildingConstructionType.Name,
                            BuildingOccupantTypeId = b.BuildingOccupantTypeId,
                            BuildingOccupantType = b.BuildingOccupantType.Name,
                            BuildingPredominateUseId = b.BuildingPredominateUseId,
                            BuildingPredominateUse = b.BuildingPredominateUse.Name,
                            BuildingTenancy = b.BuildingTenancy,

                            PID = b.Parcels.FirstOrDefault().Parcel.PID,
                            PIN = b.Parcels.FirstOrDefault().Parcel.PIN,
                            Zoning = b.Parcels.FirstOrDefault().Parcel.Zoning,
                            ZoningPotential = b.Parcels.FirstOrDefault().Parcel.ZoningPotential,
                            LandArea = b.Parcels.FirstOrDefault().Parcel.LandArea,
                            LandLegalDescription = b.Parcels.FirstOrDefault().Parcel.LandLegalDescription
                        })
                        .Union(
                            from p in this.Context.Parcels
                            select new Entities.Views.Property()
                            {
                                Id = p.Id,
                                PropertyTypeId = PropertyTypes.Land,
                                ClassificationId = p.ClassificationId,
                                Classification = p.Classification.Name,
                                Name = p.Name,
                                Description = p.Description,
                                IsSensitive = p.IsSensitive,
                                IsVisibleToOtherAgencies = p.IsVisibleToOtherAgencies,
                                Location = p.Location,
                                Boundary = p.Boundary,

                                Address = $"{p.Address.Address1} {p.Address.Address2})".Trim(),
                                AdministrativeArea = p.Address.AdministrativeArea,
                                Province = p.Address.Province.Name,
                                Postal = p.Address.Postal,

                                AgencyId = p.AgencyId,
                                Agency = p.Agency.ParentId.HasValue ? p.Agency.Parent.Name : p.Agency.Name,
                                AgencyCode = p.Agency.ParentId.HasValue ? p.Agency.Parent.Code : p.Agency.Code,
                                SubAgency = p.Agency.ParentId.HasValue ? null : p.Agency.Name,
                                SubAgencyCode = p.Agency.ParentId.HasValue ? null : p.Agency.Code,

                                Market = p.Fiscals.Any(f => f.Key == FiscalKeys.Market) ? p.Fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == FiscalKeys.Market).Value : (decimal?)null,
                                MarketFiscalYear = p.Fiscals.Any(f => f.Key == FiscalKeys.Market) ? p.Fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == FiscalKeys.Market).FiscalYear : (int?)null,
                                NetBook = p.Fiscals.Any(f => f.Key == FiscalKeys.NetBook) ? p.Fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == FiscalKeys.NetBook).Value : (decimal?)null,
                                NetBookFiscalYear = p.Fiscals.Any(f => f.Key == FiscalKeys.NetBook) ? p.Fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == FiscalKeys.NetBook).FiscalYear : (int?)null,
                                AssessedLand = p.Evaluations.Any(f => f.Key == EvaluationKeys.Assessed) ? p.Evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == EvaluationKeys.Assessed).Value : (decimal?)null,
                                AssessedLandDate = p.Evaluations.Any(f => f.Key == EvaluationKeys.Assessed) ? p.Evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == EvaluationKeys.Assessed).Date : (DateTime?)null,
                                AssessedBuilding = p.Evaluations.Any(f => f.Key == EvaluationKeys.Improvements) ? p.Evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == EvaluationKeys.Improvements).Value : (decimal?)null,
                                AssessedBuildingDate = p.Evaluations.Any(f => f.Key == EvaluationKeys.Improvements) ? p.Evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == EvaluationKeys.Improvements).Date : (DateTime?)null,

                                RentableArea = 0,
                                BuildingFloorCount = 0,
                                BuildingConstructionTypeId = 0,
                                BuildingConstructionType = null,
                                BuildingOccupantTypeId = 0,
                                BuildingOccupantType = null,
                                BuildingPredominateUseId = 0,
                                BuildingPredominateUse = null,
                                BuildingTenancy = null,

                                PID = p.PID,
                                PIN = p.PIN,
                                Zoning = p.Zoning,
                                ZoningPotential = p.ZoningPotential,
                                LandArea = p.LandArea,
                                LandLegalDescription = p.LandLegalDescription
                            }
                        ));
            }
        }
        #endregion
    }
}
