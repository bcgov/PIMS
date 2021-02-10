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
            {
                var poly = new NetTopologySuite.Geometries.Envelope(filter.NELongitude.Value, filter.SWLongitude.Value, filter.NELatitude.Value, filter.SWLatitude.Value).ToPolygon();
                query = query.Where(p => poly.Contains(p.Location));
            }

            if (filter.Agencies?.Any() == true)
            {
                var filterAgencies = filter.Agencies.Select(a => (int?)a);
                query = query.Where(p => filterAgencies.Contains(p.AgencyId));
            }
            if (filter.ClassificationId.HasValue)
                query = query.Where(p => p.ClassificationId == filter.ClassificationId);
            if (!String.IsNullOrWhiteSpace(filter.ProjectNumber))
                query = query.Where(p => p.ProjectNumbers.Contains(filter.ProjectNumber));
            if (!String.IsNullOrWhiteSpace(filter.Description))
                query = query.Where(p => EF.Functions.Like(p.Description, $"%{filter.Description}%"));
            if (!String.IsNullOrWhiteSpace(filter.AdministrativeArea))
                query = query.Where(p => EF.Functions.Like(p.Address.AdministrativeArea, $"%{filter.AdministrativeArea}%"));
            if (!String.IsNullOrWhiteSpace(filter.Zoning))
                query = query.Where(p => EF.Functions.Like(p.Zoning, $"%{filter.Zoning}%"));
            if (!String.IsNullOrWhiteSpace(filter.ZoningPotential))
                query = query.Where(p => EF.Functions.Like(p.ZoningPotential, $"%{filter.ZoningPotential}%"));

            // TODO: Parse the address information by City, Postal, etc.
            if (!String.IsNullOrWhiteSpace(filter.Address))
                query = query.Where(p => EF.Functions.Like(p.Address.Address1, $"%{filter.Address}%") || EF.Functions.Like(p.Address.AdministrativeArea, $"%{filter.Address}%"));

            if (filter.MinLandArea.HasValue)
                query = query.Where(p => p.LandArea >= filter.MinLandArea);
            if (filter.MaxLandArea.HasValue)
                query = query.Where(p => p.LandArea <= filter.MaxLandArea);

            // TODO: Review performance of the evaluation query component.
            if (filter.MinMarketValue.HasValue)
                query = query.Where(p =>
                    filter.MinMarketValue <= p.Fiscals
                        .FirstOrDefault(e => e.FiscalYear == this.Context.ParcelFiscals
                            .Where(pe => pe.ParcelId == p.Id && e.Key == FiscalKeys.Market)
                            .Max(pe => pe.FiscalYear))
                        .Value);
            if (filter.MaxMarketValue.HasValue)
                query = query.Where(p =>
                    filter.MaxMarketValue >= p.Fiscals
                        .FirstOrDefault(e => e.FiscalYear == this.Context.ParcelFiscals
                            .Where(pe => pe.ParcelId == p.Id && e.Key == FiscalKeys.Market)
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
                .Include(p => p.Address).ThenInclude(a => a.Province)
                .Include(p => p.Agency).ThenInclude(a => a.Parent)
                .Include(p => p.Evaluations)
                .Include(p => p.Fiscals)
                .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.Address)
                .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.Address.Province)
                .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.BuildingConstructionType)
                .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.BuildingPredominateUse)
                .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.BuildingOccupantType)
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
                .Include(p => p.Address).ThenInclude(a => a.Province)
                .Include(p => p.Agency)
                .Include(p => p.Agency.Parent)
                .Include(p => p.Evaluations)
                .Include(p => p.Fiscals)
                .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.Address)
                .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.Address.Province)
                .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.BuildingConstructionType)
                .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.BuildingPredominateUse)
                .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.BuildingOccupantType)
                .Where(p => p.PID == pid);

            if (!parcels.Any()) throw new KeyNotFoundException();
            if (parcels.Count() == 1) return parcels.First();
            return parcels.SingleOrDefault(p => p.PIN == null) ?? throw new InvalidOperationException($"Parcel '{pid}' does not have a titled property, but has {parcels.Count()} untitled properties."); // If there isn't a primary titled property, throw an exception.
        }

        /// <summary>
        /// Get the parcel for the specified 'pid'.
        /// </summary>
        /// <param name="pid"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public Parcel GetByPidWithoutTracking(int pid)
        {
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            var parcels = this.Context.Parcels
                .Include(p => p.Classification)
                .Include(p => p.Address).ThenInclude(a => a.Province)
                .Include(p => p.Agency)
                .Include(p => p.Agency.Parent)
                .Include(p => p.Evaluations)
                .Include(p => p.Fiscals)
                .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.Address)
                .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.Address.Province)
                .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.BuildingConstructionType)
                .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.BuildingPredominateUse)
                .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.BuildingOccupantType)
                .AsNoTracking().Where(p => p.PID == pid);

            if (!parcels.Any()) throw new KeyNotFoundException();
            if (parcels.Count() == 1) return parcels.First();
            return parcels.SingleOrDefault(p => p.PIN == null) ?? throw new InvalidOperationException($"Parcel '{pid}' does not have a titled property, but has {parcels.Count()} untitled properties."); // If there isn't a primary titled property, throw an exception.
        }

        /// <summary>
        /// Add the specified parcel to the datasource.
        /// </summary>
        /// <param name="parcel"></param>
        /// <returns></returns>
        public override void Add(Parcel parcel)
        {
            parcel.ThrowIfNull(nameof(parcel));
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);
            this.Context.Parcels.ThrowIfNotUnique(parcel);

            if (parcel.Agency != null && !this.Context.Agencies.Local.Any(a => a.Id == parcel.AgencyId))
                this.Context.Entry(parcel.Agency).State = EntityState.Unchanged;
            if (parcel.Classification != null && !this.Context.PropertyClassifications.Local.Any(a => a.Id == parcel.ClassificationId))
                this.Context.Entry(parcel.Classification).State = EntityState.Unchanged;

            parcel.PropertyTypeId = (int)(parcel.Parcels.Count > 0 ? PropertyTypes.Subdivision : PropertyTypes.Land);
            parcel.Agency = this.Context.Agencies.Local.FirstOrDefault(a => a.Id == parcel.AgencyId);
            parcel.Classification = this.Context.PropertyClassifications.Local.FirstOrDefault(a => a.Id == parcel.ClassificationId);

            parcel.Buildings.ForEach(pb =>
            {
                pb.Parcel = parcel;
                var building = pb.Building;
                this.Context.Buildings.Add(building);
                if (building.Agency != null && !this.Context.Agencies.Local.Any(a => a.Id == building.AgencyId))
                    this.Context.Entry(building.Agency).State = EntityState.Unchanged;
                if (building.Classification != null && !this.Context.PropertyClassifications.Local.Any(a => a.Id == building.ClassificationId))
                    this.Context.Entry(building.Classification).State = EntityState.Unchanged;
                if (building.BuildingConstructionType != null && !this.Context.BuildingConstructionTypes.Local.Any(a => a.Id == building.BuildingConstructionTypeId))
                    this.Context.Entry(building.BuildingConstructionType).State = EntityState.Unchanged;
                if (building.BuildingPredominateUse != null && !this.Context.BuildingPredominateUses.Local.Any(a => a.Id == building.BuildingPredominateUseId))
                    this.Context.Entry(building.BuildingPredominateUse).State = EntityState.Unchanged;
                if (building.BuildingOccupantType != null && !this.Context.BuildingOccupantTypes.Local.Any(a => a.Id == building.BuildingOccupantTypeId))
                    this.Context.Entry(building.BuildingOccupantType).State = EntityState.Unchanged;

                building.Agency = this.Context.Agencies.Local.FirstOrDefault(a => a.Id == building.AgencyId);
                building.Classification = this.Context.PropertyClassifications.Local.FirstOrDefault(a => a.Id == building.ClassificationId);
                building.BuildingConstructionType = this.Context.BuildingConstructionTypes.Local.FirstOrDefault(a => a.Id == building.BuildingConstructionTypeId);
                building.BuildingPredominateUse = this.Context.BuildingPredominateUses.Local.FirstOrDefault(a => a.Id == building.BuildingPredominateUseId);
                building.BuildingOccupantType = this.Context.BuildingOccupantTypes.Local.FirstOrDefault(a => a.Id == building.BuildingOccupantTypeId);

                this.Context.BuildingEvaluations.AddRange(building.Evaluations);
                this.Context.BuildingFiscals.AddRange(building.Fiscals);

                if (building.Address != null)
                {
                    this.Context.Addresses.Add(building.Address);
                }

            });

            this.Context.ParcelEvaluations.AddRange(parcel.Evaluations);
            this.Context.ParcelFiscals.AddRange(parcel.Fiscals);

            if (parcel.Address != null)
            {
                this.Context.Addresses.Add(parcel.Address);
            }

            base.Add(parcel);
        }

        /// <summary>
        /// Add the collection of parcels to the datasource.
        /// </summary>
        /// <param name="entities"></param>
        /// <returns></returns>
        public IEnumerable<Parcel> Add(IEnumerable<Parcel> parcels)
        {
            parcels.ThrowIfNull(nameof(parcels));
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            parcels.ForEach(parcel =>
            {
                parcel.PropertyTypeId = (int)(parcel.Parcels.Count > 0 ? PropertyTypes.Subdivision : PropertyTypes.Land);
                if (parcel == null) throw new ArgumentNullException();

                if (parcel.AgencyId != 0 && !this.Context.Agencies.Local.Any(a => a.Id == parcel.AgencyId))
                    this.Context.Entry(parcel.Agency).State = EntityState.Unchanged;
                if (parcel.Classification != null && !this.Context.PropertyClassifications.Local.Any(a => a.Id == parcel.ClassificationId))
                    this.Context.Entry(parcel.Classification).State = EntityState.Unchanged;

                parcel.Agency = this.Context.Agencies.Local.FirstOrDefault(a => a.Id == parcel.AgencyId);
                parcel.Classification = this.Context.PropertyClassifications.Local.FirstOrDefault(a => a.Id == parcel.ClassificationId);

                parcel.Buildings.ForEach(pb =>
                {
                    pb.Parcel = parcel;
                    var building = pb.Building;
                    this.Context.Buildings.Add(building);
                    if (building.Agency != null && !this.Context.Agencies.Local.Any(a => a.Id == building.AgencyId))
                        this.Context.Entry(building.Agency).State = EntityState.Unchanged;
                    if (building.Classification != null && !this.Context.PropertyClassifications.Local.Any(a => a.Id == building.ClassificationId))
                        this.Context.Entry(building.Classification).State = EntityState.Unchanged;
                    if (building.BuildingConstructionType != null && !this.Context.BuildingConstructionTypes.Local.Any(a => a.Id == building.BuildingConstructionTypeId))
                        this.Context.Entry(building.BuildingConstructionType).State = EntityState.Unchanged;
                    if (building.BuildingPredominateUse != null && !this.Context.BuildingPredominateUses.Local.Any(a => a.Id == building.BuildingPredominateUseId))
                        this.Context.Entry(building.BuildingPredominateUse).State = EntityState.Unchanged;
                    if (building.BuildingOccupantType != null && !this.Context.BuildingOccupantTypes.Local.Any(a => a.Id == building.BuildingOccupantTypeId))
                        this.Context.Entry(building.BuildingOccupantType).State = EntityState.Unchanged;

                    building.Agency = this.Context.Agencies.Local.FirstOrDefault(a => a.Id == building.AgencyId);
                    building.Classification = this.Context.PropertyClassifications.Local.FirstOrDefault(a => a.Id == building.ClassificationId);
                    building.BuildingConstructionType = this.Context.BuildingConstructionTypes.Local.FirstOrDefault(a => a.Id == building.BuildingConstructionTypeId);
                    building.BuildingPredominateUse = this.Context.BuildingPredominateUses.Local.FirstOrDefault(a => a.Id == building.BuildingPredominateUseId);
                    building.BuildingOccupantType = this.Context.BuildingOccupantTypes.Local.FirstOrDefault(a => a.Id == building.BuildingOccupantTypeId);

                    building.Evaluations.ForEach(e =>
                    {
                        this.Context.BuildingEvaluations.Add(e);
                    });
                    building.Fiscals.ForEach(f =>
                    {
                        this.Context.BuildingFiscals.Add(f);
                    });

                    if (building.Address != null)
                    {
                        this.Context.Addresses.Add(building.Address);
                    }
                });

                parcel.Evaluations.ForEach(e =>
                {
                    this.Context.ParcelEvaluations.Add(e);
                });
                parcel.Fiscals.ForEach(f =>
                {
                    this.Context.ParcelFiscals.Add(f);
                });

                if (parcel.Address != null)
                {
                    this.Context.Addresses.Add(parcel.Address);
                }
            });

            this.Context.Parcels.AddRange(parcels);
            this.Context.CommitTransaction();
            return parcels;
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
            parcel.PropertyTypeId = originalParcel.PropertyTypeId;

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
            this.Context.Entry(originalParcel).Collection(p => p.Buildings).Load();
            this.Context.Entry(originalParcel).Collection(p => p.Evaluations).Load();
            this.Context.Entry(originalParcel).Collection(p => p.Fiscals).Load();
            this.Context.Entry(originalParcel).Collection(p => p.Projects).Load();

            this.Context.Entry(originalParcel).CurrentValues.SetValues(parcel);
            originalParcel.Buildings.Clear();
            originalParcel.Evaluations.Clear();
            originalParcel.Fiscals.Clear();
            originalParcel.Projects.Clear();
            base.Remove(originalParcel);
        }
        #endregion
    }
}
