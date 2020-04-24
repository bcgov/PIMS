using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;
using System.Linq;

namespace Pims.Dal.Configuration
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
                            StatusId = b.StatusId,
                            ClassificationId = b.ClassificationId,
                            Description = b.Description,
                            Latitude = b.Latitude,
                            Longitude = b.Longitude,
                            Address = b.Address.Address1,
                            City = b.Address.City.Name,
                            Province = b.Address.Province.Name,
                            Postal = b.Address.Postal,
                            AgencyId = b.AgencyId,
                            Agency = b.Agency.Name,

                            Estimated = b.Fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == FiscalKeys.Estimated).Value,
                            EstimatedFiscalYear = b.Fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == FiscalKeys.Estimated).FiscalYear,
                            NetBook = b.Fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == FiscalKeys.NetBook).Value,
                            NetBookFiscalYear = b.Fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == FiscalKeys.NetBook).FiscalYear,
                            Assessed = b.Evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == EvaluationKeys.Assessed).Value,
                            AssessedDate = b.Evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == EvaluationKeys.Assessed).Date,
                            Appraised = b.Evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == EvaluationKeys.Appraised).Value,
                            AppraisedDate = b.Evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == EvaluationKeys.Appraised).Date,

                            RentableArea = b.RentableArea,
                            BuildingConstructionTypeId = b.BuildingConstructionTypeId,
                            BuildingFloorCount = b.BuildingFloorCount,
                            BuildingOccupantTypeId = b.BuildingOccupantTypeId,
                            BuildingPredominateUseId = b.BuildingPredominateUseId,
                            BuildingTenancy = b.BuildingTenancy,

                            PID = b.Parcel.PID,
                            PIN = b.Parcel.PIN,
                            Municipality = b.Parcel.Municipality,
                            Zoning = b.Parcel.Zoning,
                            ZoningPotential = b.Parcel.ZoningPotential,
                            LandArea = b.Parcel.LandArea,
                            LandLegalDescription = b.Parcel.LandLegalDescription
                        })
                        .Union(
                            from p in this.Context.Parcels
                            select new Entities.Views.Property()
                            {
                                Id = p.Id,
                                StatusId = p.StatusId,
                                ClassificationId = p.ClassificationId,
                                Description = p.Description,
                                Latitude = p.Latitude,
                                Longitude = p.Longitude,
                                Address = p.Address.Address1,
                                City = p.Address.City.Name,
                                Province = p.Address.Province.Name,
                                Postal = p.Address.Postal,
                                AgencyId = p.AgencyId,
                                Agency = p.Agency.Name,

                                Estimated = p.Fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == FiscalKeys.Estimated).Value,
                                EstimatedFiscalYear = p.Fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == FiscalKeys.Estimated).FiscalYear,
                                NetBook = p.Fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == FiscalKeys.NetBook).Value,
                                NetBookFiscalYear = p.Fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == FiscalKeys.NetBook).FiscalYear,
                                Assessed = p.Evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == EvaluationKeys.Assessed).Value,
                                AssessedDate = p.Evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == EvaluationKeys.Assessed).Date,
                                Appraised = p.Evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == EvaluationKeys.Appraised).Value,
                                AppraisedDate = p.Evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == EvaluationKeys.Appraised).Date,

                                RentableArea = 0,
                                BuildingConstructionTypeId = 0,
                                BuildingFloorCount = 0,
                                BuildingOccupantTypeId = 0,
                                BuildingPredominateUseId = 0,
                                BuildingTenancy = null,

                                PID = p.PID,
                                PIN = p.PIN,
                                Municipality = p.Municipality,
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
