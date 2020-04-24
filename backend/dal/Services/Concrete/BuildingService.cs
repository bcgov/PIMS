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
        public IEnumerable<Building> Get(double neLat, double neLong, double swLat, double swLong)
        {
            this.User.ThrowIfNotAuthorized(Permissions.PropertyView);
            // Check if user has the ability to view sensitive properties.
            var userAgencies = this.User.GetAgencies();
            var viewSensitive = this.User.HasPermission(Permissions.SensitiveView);

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
        public IEnumerable<Building> Get(BuildingFilter filter)
        {
            this.User.ThrowIfNotAuthorized(Permissions.PropertyView);
            var query = this.Context.GenerateQuery(this.User, filter);
            return query.ToArray();
        }

        /// <summary>
        /// Get an array of buildings within the specified filter.
        /// Will not return sensitive buildings unless the user has the `sensitive-view` claim and belongs to the owning agency.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public Paged<Building> GetPage(BuildingFilter filter)
        {
            this.User.ThrowIfNotAuthorized(Permissions.PropertyView);
            var query = this.Context.GenerateQuery(this.User, filter);
            var total = query.Count();
            var items = query.Skip((filter.Page - 1) * filter.Quantity).Take(filter.Quantity);

            return new Paged<Building>(items, filter.Page, filter.Quantity, total);
        }

        /// <summary>
        /// Get the building for the specified 'id'.
        /// Will not return sensitive buildings unless the user has the `sensitive-view` claim and belongs to the owning agency.
        /// </summary>
        /// <param name="id"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public Building Get(int id)
        {
            this.User.ThrowIfNotAuthorized(Permissions.PropertyView);
            // Check if user has the ability to view sensitive properties.
            var userAgencies = this.User.GetAgencies();
            var viewSensitive = this.User.HasPermission(Permissions.SensitiveView);

            var building = this.Context.Buildings
                .Include(p => p.Parcel)
                .Include(p => p.BuildingPredominateUse)
                .Include(p => p.BuildingConstructionType)
                .Include(p => p.BuildingOccupantType)
                .Include(p => p.Address)
                .Include(p => p.Address.City)
                .Include(p => p.Address.Province)
                .Include(p => p.Agency)
                .Include(p => p.Agency.Parent)
                .Include(p => p.Evaluations)
                .Include(p => p.Fiscals)
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

            this.Context.Buildings.Update(entity); // TODO: Must detach entity before returning it.
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
