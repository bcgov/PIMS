using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pims.Core.Extensions;
using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;

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
        /// <param name="logger"></param>
        public ParcelService(PimsContext dbContext, ClaimsPrincipal user, ILogger<ParcelService> logger) : base(dbContext, user, logger) { }
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
            var userAgencies = this.User.GetAgencies();
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
                query = query.Where(p => filter.Agencies.Contains(p.AgencyId));
            if (filter.ClassificationId.HasValue)
                query = query.Where(p => p.ClassificationId == filter.ClassificationId);
            if (filter.StatusId.HasValue)
                query = query.Where(p => p.StatusId == filter.StatusId);

            // TODO: Parse the address information by City, Postal, etc.
            if (!String.IsNullOrWhiteSpace(filter.Address))
                query = query.Where(p => EF.Functions.Like(p.Address.Address1, $"%{filter.Address}%") || EF.Functions.Like(p.Address.City.Name, $"%{filter.Address}%"));

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

            if (filter.MinLandArea.HasValue)
                query = query.Where(p => p.LandArea >= filter.MinLandArea);
            if (filter.MaxLandArea.HasValue)
                query = query.Where(p => p.LandArea <= filter.MaxLandArea);

            // TODO: Review performance of the evaluation query component.
            if (filter.MinEstimatedValue.HasValue)
                query = query.Where(p =>
                    filter.MinEstimatedValue <= p.Evaluations
                    .FirstOrDefault(e => e.FiscalYear == this.Context.ParcelEvaluations
                    .Where(pe => pe.ParcelId == p.Id)
                    .Max(pe => pe.FiscalYear)).EstimatedValue);
            if (filter.MaxEstimatedValue.HasValue)
                query = query.Where(p =>
                    filter.MaxEstimatedValue >= p.Evaluations
                    .FirstOrDefault(e => e.FiscalYear == this.Context.ParcelEvaluations
                    .Where(pe => pe.ParcelId == p.Id)
                    .Max(pe => pe.FiscalYear)).EstimatedValue);

            // TODO: Review performance of the evaluation query component.
            if (filter.MinAssessedValue.HasValue)
                query = query.Where(p =>
                    filter.MinAssessedValue <= p.Evaluations
                    .FirstOrDefault(e => e.FiscalYear == this.Context.ParcelEvaluations
                    .Where(pe => pe.ParcelId == p.Id)
                    .Max(pe => pe.FiscalYear)).AssessedValue);
            if (filter.MaxAssessedValue.HasValue)
                query = query.Where(p =>
                    filter.MaxAssessedValue >= p.Evaluations
                    .FirstOrDefault(e => e.FiscalYear == this.Context.ParcelEvaluations
                    .Where(pe => pe.ParcelId == p.Id)
                    .Max(pe => pe.FiscalYear)).AssessedValue);

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
                .Include(p => p.Status)
                .Include(p => p.Classification)
                .Include(p => p.Address)
                .Include(p => p.Address.City)
                .Include(p => p.Address.Province)
                .Include(p => p.Agency)
                .Include(p => p.Agency.Parent)
                .Include(p => p.Evaluations)
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

            return this.Context.Parcels
                .Include(p => p.Status)
                .Include(p => p.Classification)
                .Include(p => p.Address)
                .Include(p => p.Address.City)
                .Include(p => p.Address.Province)
                .Include(p => p.Agency)
                .Include(p => p.Agency.Parent)
                .Include(p => p.Evaluations)
                .Include(p => p.Buildings)
                .Include(p => p.Buildings).ThenInclude(b => b.Address)
                .Include(p => p.Buildings).ThenInclude(b => b.Address.City)
                .Include(p => p.Buildings).ThenInclude(b => b.Address.Province)
                .Include(p => p.Buildings).ThenInclude(b => b.BuildingConstructionType)
                .Include(p => p.Buildings).ThenInclude(b => b.BuildingPredominateUse)
                .Include(p => p.Buildings).ThenInclude(b => b.BuildingOccupantType)
                .AsNoTracking().SingleOrDefault(u => u.PID == pid) ?? throw new KeyNotFoundException();
        }

        /// <summary>
        /// Add the specified parcel to the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public override Parcel Add(Parcel entity)
        {
            entity.ThrowIfNull(nameof(entity));
            this.Context.Parcels.ThrowIfNotUnique(entity);

            entity.Buildings.ForEach(b =>
            {
                this.Context.Buildings.Add(b);

                b.Evaluations.ForEach(e =>
                {
                    this.Context.BuildingEvaluations.Add(e);
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

            if (entity.Address != null)
            {
                this.Context.Addresses.Add(entity.Address);
            }

            return base.Add(entity);
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

                entity.Buildings.ForEach(b =>
                {
                    this.Context.Buildings.Add(b);

                    b.Evaluations.ForEach(e =>
                    {
                        this.Context.BuildingEvaluations.Add(e);
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
        /// <param name="entity"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public override Parcel Update(Parcel entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var parcel = this.Context.Parcels.Find(entity.Id) ?? throw new KeyNotFoundException();

            this.Context.Entry(parcel).CurrentValues.SetValues(entity);

            this.Context.Parcels.ThrowIfNotUnique(entity);

            // TODO: Update child properties appropriately.
            return base.Update(parcel);
        }

        /// <summary>
        /// Remove the specified parcel from the datasource.
        /// </summary>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <param name="entity"></param>
        public override void Remove(Parcel entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var parcel = this.Context.Parcels.Find(entity.Id) ?? throw new KeyNotFoundException();

            this.Context.Entry(parcel).CurrentValues.SetValues(entity);
            base.Remove(parcel);
        }
        #endregion
    }
}
