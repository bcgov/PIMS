using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pims.Core.Extensions;
using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;
using Pims.Dal.Exceptions;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace Pims.Dal.Services
{
    /// <summary>
    /// BuildingService class, provides a service layer to interact with buildings within the datasource.
    /// </summary>
    public class BuildingService : BaseService<Building>, IBuildingService
    {
        #region Constructors
        /// <summary>
        /// Creates a new instance of a BuildingService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="logger"></param>
        public BuildingService(PimsContext dbContext, ClaimsPrincipal user, ILogger<BuildingService> logger) : base(dbContext, user, logger) { }
        #endregion

        #region Methods
        /// <summary>
        /// Get a collection of buildings within the specified filter.
        /// Will not return sensitive buildings unless the user has the `sensitive-view` claim and belongs to the owning agency.
        /// </summary>
        /// <param name="neLat"></param>
        /// <param name="neLong"></param>
        /// <param name="swLat"></param>
        /// <param name="swLong"></param>
        /// <returns></returns>
        public IEnumerable<Building> GetNoTracking(double neLat, double neLong, double swLat, double swLong)
        {
            // Check if user has the ability to view sensitive properties.
            var userAgencies = this.User.GetAgencies();
            var viewSensitive = this.User.HasPermission(Security.Permissions.SensitiveView);

            IQueryable<Building> query = null;
            // Users may only view sensitive properties if they have the `sensitive-view` claim and belong to the owning agency.
            query = this.Context.Buildings
                .Include(b => b.Parcel)
                .AsNoTracking()
                .Where(p =>
                (!p.IsSensitive || (viewSensitive && userAgencies.Contains(p.AgencyId))) &&
                p.Latitude != 0 &&
                p.Longitude != 0 &&
                p.Latitude <= neLat &&
                p.Latitude >= swLat &&
                p.Longitude <= neLong &&
                p.Longitude >= swLong);
            return query.ToArray();
        }

        /// <summary>
        /// Get an array of buildings within the specified filter.
        /// Will not return sensitive buildings unless the user has the `sensitive-view` claim and belongs to the owning agency.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public IEnumerable<Building> GetNoTracking(BuildingFilter filter)
        {
            filter.ThrowIfNull(nameof(filter));

            // Check if user has the ability to view sensitive properties.
            var userAgencies = this.User.GetAgencies();
            var viewSensitive = this.User.HasPermission(Security.Permissions.SensitiveView);

            // Users may only view sensitive properties if they have the `sensitive-view` claim and belong to the owning agency.
            var query = this.Context.Buildings.AsNoTracking().Where(p =>
                !p.IsSensitive || (viewSensitive && userAgencies.Contains(p.AgencyId)));

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
            if (filter.ConstructionTypeId.HasValue)
                query = query.Where(p => p.BuildingConstructionTypeId == filter.ConstructionTypeId);
            if (filter.PredominateUseId.HasValue)
                query = query.Where(p => p.BuildingPredominateUseId == filter.PredominateUseId);
            if (filter.FloorCount.HasValue)
                query = query.Where(p => p.BuildingFloorCount == filter.FloorCount);
            if (!String.IsNullOrWhiteSpace(filter.Tenancy))
                query = query.Where(p => p.BuildingTenancy == filter.Tenancy);

            if (!String.IsNullOrWhiteSpace(filter.Address)) // TODO: Parse the address information by City, Postal, etc.
                query.Where(p => EF.Functions.Like(p.Address.Address1, $"%{filter.Address}%"));

            if (filter.MinRentableArea.HasValue && filter.MaxRentableArea.HasValue)
                query = query.Where(p => p.RentableArea >= filter.MinRentableArea && p.RentableArea <= filter.MaxRentableArea);
            else if (filter.MinRentableArea.HasValue)
                query = query.Where(p => p.RentableArea >= filter.MinRentableArea);
            else if (filter.MaxRentableArea.HasValue)
                query = query.Where(p => p.RentableArea <= filter.MaxRentableArea);

            if (filter.MinEstimatedValue.HasValue && filter.MaxEstimatedValue.HasValue) // TODO: Review performance of the evaluation query component.
                query = query.Where(p =>
                    filter.MinEstimatedValue <= p.Evaluations
                    .FirstOrDefault(e => e.FiscalYear == this.Context.ParcelEvaluations
                    .Where(pe => pe.ParcelId == p.Id)
                    .Max(pe => pe.FiscalYear)).EstimatedValue &&
                    filter.MaxEstimatedValue >= p.Evaluations
                    .FirstOrDefault(e => e.FiscalYear == this.Context.ParcelEvaluations
                    .Where(pe => pe.ParcelId == p.Id)
                    .Max(pe => pe.FiscalYear)).EstimatedValue);
            else if (filter.MinEstimatedValue.HasValue)
                query = query.Where(p =>
                    filter.MinEstimatedValue <= p.Evaluations
                    .FirstOrDefault(e => e.FiscalYear == this.Context.ParcelEvaluations
                    .Where(pe => pe.ParcelId == p.Id)
                    .Max(pe => pe.FiscalYear)).EstimatedValue);
            else if (filter.MaxEstimatedValue.HasValue)
                query = query.Where(p =>
                    filter.MaxEstimatedValue >= p.Evaluations
                    .FirstOrDefault(e => e.FiscalYear == this.Context.ParcelEvaluations
                    .Where(pe => pe.ParcelId == p.Id)
                    .Max(pe => pe.FiscalYear)).EstimatedValue);

            if (filter.MinAssessedValue.HasValue && filter.MaxAssessedValue.HasValue) // TODO: Review performance of the evaluation query component.
                query = query.Where(p =>
                    filter.MinAssessedValue <= p.Evaluations
                    .FirstOrDefault(e => e.FiscalYear == this.Context.ParcelEvaluations
                    .Where(pe => pe.ParcelId == p.Id)
                    .Max(pe => pe.FiscalYear)).AssessedValue &&
                    filter.MaxAssessedValue >= p.Evaluations
                    .FirstOrDefault(e => e.FiscalYear == this.Context.ParcelEvaluations
                    .Where(pe => pe.ParcelId == p.Id)
                    .Max(pe => pe.FiscalYear)).AssessedValue);
            else if (filter.MinAssessedValue.HasValue)
                query = query.Where(p =>
                    filter.MinAssessedValue <= p.Evaluations
                    .FirstOrDefault(e => e.FiscalYear == this.Context.ParcelEvaluations
                    .Where(pe => pe.ParcelId == p.Id)
                    .Max(pe => pe.FiscalYear)).AssessedValue);
            else if (filter.MaxAssessedValue.HasValue)
                query = query.Where(p =>
                    filter.MaxAssessedValue >= p.Evaluations
                    .FirstOrDefault(e => e.FiscalYear == this.Context.ParcelEvaluations
                    .Where(pe => pe.ParcelId == p.Id)
                    .Max(pe => pe.FiscalYear)).AssessedValue);

            if (filter.Sort?.Any() == true)
                query = query.OrderByProperty(filter.Sort);

            return query.ToArray();
        }

        /// <summary>
        /// Get the building for the specified 'id'.
        /// Will not return sensitive buildings unless the user has the `sensitive-view` claim and belongs to the owning agency.
        /// </summary>
        /// <param name="id"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public Building GetNoTracking(int id)
        {
            // Check if user has the ability to view sensitive properties.
            var userAgencies = this.User.GetAgencies();
            var viewSensitive = this.User.HasPermission(Security.Permissions.SensitiveView);

            var building = this.Context.Buildings
                .Include(p => p.Parcel)
                .Include(p => p.BuildingPredominateUse)
                .Include(p => p.BuildingConstructionType)
                .Include(p => p.Address)
                .Include(p => p.Address.City)
                .Include(p => p.Address.Province)
                .Include(p => p.Agency)
                .Include(p => p.Agency.Parent)
                .Include(p => p.Evaluations)
                .AsNoTracking()
                .FirstOrDefault(b => b.Id == id &&
                    (!b.IsSensitive || (viewSensitive && userAgencies.Contains(b.AgencyId)))) ?? throw new KeyNotFoundException();

            return building;
        }

        /// <summary>
        /// Add the specified building to the datasource.
        /// </summary>
        /// <param name="building"></param>
        /// <returns></returns>
        public Building Add(Building building)
        {
            building.ThrowIfNull(nameof(building));
            this.User.ThrowIfNotAuthorized(Permissions.PropertyAdd);

            var agency_id = this.User.GetAgency() ??
                throw new NotAuthorizedException("User must belong to an agency before adding buildings.");

            this.Context.Buildings.ThrowIfNotUnique(building);

            building.CreatedById = this.User.GetUserId();
            building.AgencyId = agency_id;
            this.Context.Buildings.Add(building);
            this.Context.CommitTransaction();
            return building;
        }

        /// <summary>
        /// Update the specified building in the datasource.
        /// </summary>
        /// <param name="building"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public Building Update(Building building)
        {
            building.ThrowIfNotAllowedToEdit(nameof(building), this.User, Permissions.PropertyEdit);

            var entity = this.Context.Buildings.Find(building.Id) ?? throw new KeyNotFoundException();

            var userAgencies = this.User.GetAgencies();
            if (!userAgencies.Contains(entity.AgencyId)) throw new NotAuthorizedException("User may not edit buildings outside of their agency.");

            // Do not allow switching agencies through this method.
            if (entity.AgencyId != building.AgencyId) throw new NotAuthorizedException("Building cannot be transferred to the specified agency.");

            this.Context.Buildings.ThrowIfNotUnique(building);

            this.Context.Entry(entity).CurrentValues.SetValues(building);
            entity.UpdatedById = this.User.GetUserId();
            entity.UpdatedOn = DateTime.UtcNow;

            this.Context.Buildings.Update(entity);
            this.Context.CommitTransaction();
            return entity;
        }

        /// <summary>
        /// Remove the specified building from the datasource.
        /// </summary>
        /// <param name="building"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public void Remove(Building building)
        {
            building.ThrowIfNotAllowedToEdit(nameof(building), this.User, Permissions.PropertyAdd);

            var entity = this.Context.Buildings.Find(building.Id) ?? throw new KeyNotFoundException();

            var agency_ids = this.User.GetAgencies();
            if (!agency_ids.Contains(entity.AgencyId)) throw new NotAuthorizedException("User may not remove buildings outside of their agency.");

            this.Context.Entry(entity).CurrentValues.SetValues(building);

            this.Context.Buildings.Remove(entity); // TODO: Shouldn't be allowed to permanently delete buildings entirely.
            this.Context.CommitTransaction();
        }
        #endregion
    }
}
