using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pims.Core.Extensions;
using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// ParcelService class, provides a service layer to administrate parcel objects within the datasource.
    /// </summary>
    public class ParcelService : BaseService<Parcel>, IParcelService
    {
        #region Constructors
        /// <summary>
        /// Creates a new instance of a ParcelService class, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="service"></param>
        /// <param name="logger"></param>
        public ParcelService(PimsContext dbContext, ClaimsPrincipal user, IPimsService service, ILogger<ParcelService> logger) : base(dbContext, user, service, logger) { }
        #endregion

        #region Methods
        /// <summary>
        /// Get an array of parcels within the specified filter.
        /// Will not return sensitive parcels unless the user has the `sensitive-view` claim and belongs to the owning agency.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public Paged<Parcel> Get(ParcelFilter filter)
        {
            filter.ThrowIfNull(nameof(filter));
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            if (filter.Page < 1) throw new ArgumentException("Argument must be greater than or equal to 1.", nameof(filter.Page));
            if (filter.Quantity < 1) throw new ArgumentException("Argument must be greater than or equal to 1.", nameof(filter.Quantity));

            // Check if user has the ability to view sensitive properties.
            var userAgencies = this.User.GetAgenciesAsNullable();
            var viewSensitive = this.User.HasPermission(Security.Permissions.SensitiveView);

            // Users may only view sensitive properties if they have the `sensitive-view` claim and belong to the owning agency.
            var query = this.Context.Parcels.AsNoTracking();

            if (filter.NELatitude.HasValue && filter.NELongitude.HasValue && filter.SWLatitude.HasValue && filter.SWLongitude.HasValue)
                query = query.Where(p =>
                    p.Latitude != 0 &&
                    p.Longitude != 0 &&
                    p.Latitude <= filter.NELatitude &&
                    p.Latitude >= filter.SWLatitude &&
                    p.Longitude <= filter.NELongitude &&
                    p.Longitude >= filter.SWLongitude);

            if (filter.Agencies?.Any() == true)
            {
                var filterAgencies = filter.Agencies.Select(a => (int?)a);
                query = query.Where(p => filterAgencies.Contains(p.AgencyId));
            }
            if (filter.ClassificationId.HasValue)
                query = query.Where(p => p.ClassificationId == filter.ClassificationId);
            if (!String.IsNullOrWhiteSpace(filter.ProjectNumber))
                query = query.Where(p => EF.Functions.Like(p.ProjectNumber, $"{filter.ProjectNumber}%"));
            if (!String.IsNullOrWhiteSpace(filter.Description))
                query = query.Where(p => EF.Functions.Like(p.Description, $"%{filter.Description}%"));
            if (!String.IsNullOrWhiteSpace(filter.Municipality))
                query = query.Where(p => EF.Functions.Like(p.Municipality, $"%{filter.Municipality}%"));
            if (!String.IsNullOrWhiteSpace(filter.Zoning))
                query = query.Where(p => EF.Functions.Like(p.Zoning, $"%{filter.Zoning}%"));
            if (!String.IsNullOrWhiteSpace(filter.ZoningPotential))
                query = query.Where(p => EF.Functions.Like(p.ZoningPotential, $"%{filter.ZoningPotential}%"));

            // TODO: Parse the address information by City, Postal, etc.
            if (!String.IsNullOrWhiteSpace(filter.Address))
                query = query.Where(p => EF.Functions.Like(p.Address.Address1, $"%{filter.Address}%") || EF.Functions.Like(p.Address.City.Name, $"%{filter.Address}%"));

            if (filter.MinLandArea.HasValue)
                query = query.Where(p => p.LandArea >= filter.MinLandArea);
            if (filter.MaxLandArea.HasValue)
                query = query.Where(p => p.LandArea <= filter.MaxLandArea);

            // TODO: Review performance of the evaluation query component.
            if (filter.MinEstimatedValue.HasValue)
                query = query.Where(p =>
                    filter.MinEstimatedValue <= p.Fiscals
                        .FirstOrDefault(e => e.FiscalYear == this.Context.ParcelFiscals
                            .Where(pe => pe.ParcelId == p.Id && e.Key == FiscalKeys.Estimated)
                            .Max(pe => pe.FiscalYear))
                        .Value);
            if (filter.MaxEstimatedValue.HasValue)
                query = query.Where(p =>
                    filter.MaxEstimatedValue >= p.Fiscals
                        .FirstOrDefault(e => e.FiscalYear == this.Context.ParcelFiscals
                            .Where(pe => pe.ParcelId == p.Id && e.Key == FiscalKeys.Estimated)
                            .Max(pe => pe.FiscalYear))
                        .Value);

            // TODO: Review performance of the evaluation query component.
            if (filter.MinAssessedValue.HasValue)
                query = query.Where(p =>
                    filter.MinAssessedValue <= p.Evaluations
                        .FirstOrDefault(e => e.Date == this.Context.ParcelEvaluations
                            .Where(pe => pe.ParcelId == p.Id && e.Key == EvaluationKeys.Assessed)
                            .Max(pe => pe.Date))
                        .Value);
            if (filter.MaxAssessedValue.HasValue)
                query = query.Where(p =>
                    filter.MaxAssessedValue >= p.Evaluations
                        .FirstOrDefault(e => e.Date == this.Context.ParcelEvaluations
                            .Where(pe => pe.ParcelId == p.Id && e.Key == EvaluationKeys.Assessed)
                            .Max(pe => pe.Date))
                        .Value);

            if (filter.Sort?.Any() == true)
                query = query.OrderByProperty(filter.Sort);

            var pagedEntities = query.Skip((filter.Page - 1) * filter.Quantity).Take(filter.Quantity);
            return new Paged<Parcel>(pagedEntities, filter.Page, filter.Quantity, query.Count());
        }

        /// <summary>
        /// Get the parcel for the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public Parcel Get(int id)
        {
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            return this.Context.Parcels
                .Include(p => p.Classification)
                .Include(p => p.Address)
                .Include(p => p.Address.City)
                .Include(p => p.Address.Province)
                .Include(p => p.Agency)
                .Include(p => p.Agency.Parent)
                .Include(p => p.Evaluations)
                .Include(p => p.Fiscals)
                .Include(p => p.Buildings)
                .Include(p => p.Buildings).ThenInclude(b => b.Address)
                .Include(p => p.Buildings).ThenInclude(b => b.Address.City)
                .Include(p => p.Buildings).ThenInclude(b => b.Address.Province)
                .Include(p => p.Buildings).ThenInclude(b => b.BuildingConstructionType)
                .Include(p => p.Buildings).ThenInclude(b => b.BuildingPredominateUse)
                .Include(p => p.Buildings).ThenInclude(b => b.BuildingOccupantType)
                .AsNoTracking().SingleOrDefault(u => u.Id == id) ?? throw new KeyNotFoundException();
        }

        /// <summary>
        /// Get the parcel for the specified 'pid'.
        /// </summary>
        /// <param name="pid"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public Parcel GetByPid(int pid)
        {
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            var parcels = this.Context.Parcels
                .Include(p => p.Classification)
                .Include(p => p.Address)
                .Include(p => p.Address.City)
                .Include(p => p.Address.Province)
                .Include(p => p.Agency)
                .Include(p => p.Agency.Parent)
                .Include(p => p.Evaluations)
                .Include(p => p.Fiscals)
                .Include(p => p.Buildings)
                .Include(p => p.Buildings).ThenInclude(b => b.Address)
                .Include(p => p.Buildings).ThenInclude(b => b.Address.City)
                .Include(p => p.Buildings).ThenInclude(b => b.Address.Province)
                .Include(p => p.Buildings).ThenInclude(b => b.BuildingConstructionType)
                .Include(p => p.Buildings).ThenInclude(b => b.BuildingPredominateUse)
                .Include(p => p.Buildings).ThenInclude(b => b.BuildingOccupantType)
                .AsNoTracking().Where(p => p.PID == pid);

            if (!parcels.Any()) throw new KeyNotFoundException();
            if (parcels.Count() == 1) return parcels.First();
            return parcels.SingleOrDefault(p => p.PIN == null) ?? throw new InvalidOperationException($"Parcel '{pid}' does not have a titled property, but has {parcels.Count()} untitled properties."); // If there isn't a primary titled property, throw an exception.
        }

        /// <summary>
        /// Add the specified parcel to the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public override void Add(Parcel entity)
        {
            entity.ThrowIfNull(nameof(entity));
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);
            this.Context.Parcels.ThrowIfNotUnique(entity);

            if (entity.Agency != null && !this.Context.Agencies.Local.Any(a => a.Id == entity.AgencyId))
                this.Context.Entry(entity.Agency).State = EntityState.Unchanged;
            if (entity.Classification != null && !this.Context.PropertyClassifications.Local.Any(a => a.Id == entity.ClassificationId))
                this.Context.Entry(entity.Classification).State = EntityState.Unchanged;

            entity.Agency = this.Context.Agencies.Local.FirstOrDefault(a => a.Id == entity.AgencyId);
            entity.Classification = this.Context.PropertyClassifications.Local.FirstOrDefault(a => a.Id == entity.ClassificationId);

            entity.Buildings.ForEach(b =>
            {
                this.Context.Buildings.Add(b);
                if (b.Agency != null && !this.Context.Agencies.Local.Any(a => a.Id == b.AgencyId))
                    this.Context.Entry(b.Agency).State = EntityState.Unchanged;
                if (b.Classification != null && !this.Context.PropertyClassifications.Local.Any(a => a.Id == b.ClassificationId))
                    this.Context.Entry(b.Classification).State = EntityState.Unchanged;
                if (b.BuildingConstructionType != null && !this.Context.BuildingConstructionTypes.Local.Any(a => a.Id == b.BuildingConstructionTypeId))
                    this.Context.Entry(b.BuildingConstructionType).State = EntityState.Unchanged;
                if (b.BuildingPredominateUse != null && !this.Context.BuildingPredominateUses.Local.Any(a => a.Id == b.BuildingPredominateUseId))
                    this.Context.Entry(b.BuildingPredominateUse).State = EntityState.Unchanged;
                if (b.BuildingOccupantType != null && !this.Context.BuildingOccupantTypes.Local.Any(a => a.Id == b.BuildingOccupantTypeId))
                    this.Context.Entry(b.BuildingOccupantType).State = EntityState.Unchanged;

                b.Agency = this.Context.Agencies.Local.FirstOrDefault(a => a.Id == b.AgencyId);
                b.Classification = this.Context.PropertyClassifications.Local.FirstOrDefault(a => a.Id == b.ClassificationId);
                b.BuildingConstructionType = this.Context.BuildingConstructionTypes.Local.FirstOrDefault(a => a.Id == b.BuildingConstructionTypeId);
                b.BuildingPredominateUse = this.Context.BuildingPredominateUses.Local.FirstOrDefault(a => a.Id == b.BuildingPredominateUseId);
                b.BuildingOccupantType = this.Context.BuildingOccupantTypes.Local.FirstOrDefault(a => a.Id == b.BuildingOccupantTypeId);

                b.Evaluations.ForEach(e =>
                {
                    this.Context.BuildingEvaluations.Add(e);
                });

                b.Fiscals.ForEach(f =>
                {
                    this.Context.BuildingFiscals.Add(f);
                });

                if (b.Address != null)
                {
                    this.Context.Addresses.Add(b.Address);
                }
            });

            entity.Evaluations.ForEach(e =>
            {
                this.Context.ParcelEvaluations.Add(e);
            });

            entity.Fiscals.ForEach(f =>
            {
                this.Context.ParcelFiscals.Add(f);
            });

            if (entity.Address != null)
            {
                this.Context.Addresses.Add(entity.Address);
            }

            base.Add(entity);
        }

        /// <summary>
        /// Add the collection of parcels to the datasource.
        /// </summary>
        /// <param name="entities"></param>
        /// <returns></returns>
        public IEnumerable<Parcel> Add(IEnumerable<Parcel> entities)
        {
            entities.ThrowIfNull(nameof(entities));
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            entities.ForEach((entity) =>
            {
                if (entity == null) throw new ArgumentNullException();

                if (entity.AgencyId != 0 && !this.Context.Agencies.Local.Any(a => a.Id == entity.AgencyId))
                    this.Context.Entry(entity.Agency).State = EntityState.Unchanged;
                if (entity.Classification != null && !this.Context.PropertyClassifications.Local.Any(a => a.Id == entity.ClassificationId))
                    this.Context.Entry(entity.Classification).State = EntityState.Unchanged;

                entity.Agency = this.Context.Agencies.Local.FirstOrDefault(a => a.Id == entity.AgencyId);
                entity.Classification = this.Context.PropertyClassifications.Local.FirstOrDefault(a => a.Id == entity.ClassificationId);

                entity.Buildings.ForEach(b =>
                {
                    this.Context.Buildings.Add(b);
                    if (b.Agency != null && !this.Context.Agencies.Local.Any(a => a.Id == b.AgencyId))
                        this.Context.Entry(b.Agency).State = EntityState.Unchanged;
                    if (b.Classification != null && !this.Context.PropertyClassifications.Local.Any(a => a.Id == b.ClassificationId))
                        this.Context.Entry(b.Classification).State = EntityState.Unchanged;
                    if (b.BuildingConstructionType != null && !this.Context.BuildingConstructionTypes.Local.Any(a => a.Id == b.BuildingConstructionTypeId))
                        this.Context.Entry(b.BuildingConstructionType).State = EntityState.Unchanged;
                    if (b.BuildingPredominateUse != null && !this.Context.BuildingPredominateUses.Local.Any(a => a.Id == b.BuildingPredominateUseId))
                        this.Context.Entry(b.BuildingPredominateUse).State = EntityState.Unchanged;
                    if (b.BuildingOccupantType != null && !this.Context.BuildingOccupantTypes.Local.Any(a => a.Id == b.BuildingOccupantTypeId))
                        this.Context.Entry(b.BuildingOccupantType).State = EntityState.Unchanged;

                    b.Agency = this.Context.Agencies.Local.FirstOrDefault(a => a.Id == b.AgencyId);
                    b.Classification = this.Context.PropertyClassifications.Local.FirstOrDefault(a => a.Id == b.ClassificationId);
                    b.BuildingConstructionType = this.Context.BuildingConstructionTypes.Local.FirstOrDefault(a => a.Id == b.BuildingConstructionTypeId);
                    b.BuildingPredominateUse = this.Context.BuildingPredominateUses.Local.FirstOrDefault(a => a.Id == b.BuildingPredominateUseId);
                    b.BuildingOccupantType = this.Context.BuildingOccupantTypes.Local.FirstOrDefault(a => a.Id == b.BuildingOccupantTypeId);

                    b.Evaluations.ForEach(e =>
                    {
                        this.Context.BuildingEvaluations.Add(e);
                    });
                    b.Fiscals.ForEach(f =>
                    {
                        this.Context.BuildingFiscals.Add(f);
                    });

                    if (b.Address != null)
                    {
                        this.Context.Addresses.Add(b.Address);
                    }
                });

                entity.Evaluations.ForEach(e =>
                {
                    this.Context.ParcelEvaluations.Add(e);
                });
                entity.Fiscals.ForEach(f =>
                {
                    this.Context.ParcelFiscals.Add(f);
                });

                if (entity.Address != null)
                {
                    this.Context.Addresses.Add(entity.Address);
                }
            });

            this.Context.Parcels.AddRange(entities);
            this.Context.CommitTransaction();
            return entities;
        }

        /// <summary>
        /// Update the specified parcel in the datasource.
        /// </summary>
        /// <param name="parcel"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public override void Update(Parcel parcel)
        {
            parcel.ThrowIfNull(nameof(parcel));
            parcel.ThrowIfNotAllowedToEdit(nameof(parcel), this.User, new[] { Permissions.SystemAdmin, Permissions.AgencyAdmin });

            var originalParcel = this.Context.Parcels.Find(parcel.Id) ?? throw new KeyNotFoundException();

            var entry = this.Context.Entry(originalParcel);
            entry.CurrentValues.SetValues(parcel);
            entry.Collection(p => p.Evaluations).Load();
            entry.Collection(p => p.Fiscals).Load();

            this.Context.Parcels.ThrowIfNotUnique(parcel);

            // TODO: Update child properties appropriately.
            foreach (var e in parcel.Evaluations)
            {
                // Only add an evaluation that does not exist.
                if (!originalParcel.Evaluations.Any(pe => pe.Key == e.Key && pe.Date == e.Date))
                {
                    e.Parcel = originalParcel;
                    this.Context.ParcelEvaluations.Add(e);
                }
            }

            foreach (var f in parcel.Fiscals)
            {
                // Only add a fiscal that does not exist.
                if (!originalParcel.Fiscals.Any(pf => pf.Key == f.Key && pf.FiscalYear == f.FiscalYear))
                {
                    f.Parcel = originalParcel;
                    this.Context.ParcelFiscals.Add(f);
                }
            }

            base.Update(originalParcel);
        }

        /// <summary>
        /// Update the specified parcel financials in the datasource.
        /// </summary>
        /// <param name="parcel"></param>
        public void UpdateFinancials(Parcel parcel)
        {
            parcel.ThrowIfNull(nameof(parcel));
            parcel.ThrowIfNotAllowedToEdit(nameof(parcel), this.User, new[] { Permissions.SystemAdmin, Permissions.AgencyAdmin });

            var originalParcel = this.Context.Parcels.Find(parcel.Id) ?? throw new KeyNotFoundException();

            var entry = this.Context.Entry(originalParcel);
            entry.Collection(p => p.Evaluations).Load();
            entry.Collection(p => p.Fiscals).Load();

            foreach (var e in parcel.Evaluations)
            {
                // Only add an evaluation that does not exist.
                if (!originalParcel.Evaluations.Any(pe => pe.Key == e.Key && pe.Date == e.Date))
                {
                    e.Parcel = originalParcel;
                    this.Context.ParcelEvaluations.Add(e);
                }
            }

            foreach (var f in parcel.Fiscals)
            {
                // Only add a fiscal that does not exist.
                if (!originalParcel.Fiscals.Any(pf => pf.Key == f.Key && pf.FiscalYear == f.FiscalYear))
                {
                    f.Parcel = originalParcel;
                    this.Context.ParcelFiscals.Add(f);
                }
            }

            base.Update(originalParcel);
        }

        /// <summary>
        /// Remove the specified parcel from the datasource.
        /// </summary>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <param name="parcel"></param>
        public override void Remove(Parcel parcel)
        {
            parcel.ThrowIfNull(nameof(parcel));
            parcel.ThrowIfNotAllowedToEdit(nameof(parcel), this.User, new[] { Permissions.SystemAdmin, Permissions.AgencyAdmin });

            var originalParcel = this.Context.Parcels.Find(parcel.Id) ?? throw new KeyNotFoundException();

            this.Context.Entry(originalParcel).CurrentValues.SetValues(parcel);
            base.Remove(originalParcel);
        }
        #endregion
    }
}
