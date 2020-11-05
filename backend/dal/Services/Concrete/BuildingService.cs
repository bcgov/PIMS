using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
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
        #region Variables
        private readonly PimsOptions _options;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a BuildingService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="options"></param>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="service"></param>
        /// <param name="logger"></param>
        public BuildingService(IOptions<PimsOptions> options, PimsContext dbContext, IPimsService service, ClaimsPrincipal user, ILogger<BuildingService> logger) : base(dbContext, user, service, logger)
        {
            _options = options.Value;
        }
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
            var userAgencies = this.User.GetAgenciesAsNullable();
            var viewSensitive = this.User.HasPermission(Permissions.SensitiveView);
            var isAdmin = this.User.HasPermission(Permissions.AdminProperties);

            IQueryable<Building> query = null;
            // Users may only view sensitive properties if they have the `sensitive-view` claim and belong to the owning agency.
            query = this.Context.Buildings
                .Include(b => b.Parcels).ThenInclude(pb => pb.Parcel)
                .AsNoTracking()
                .Where(b =>
                (isAdmin || b.IsVisibleToOtherAgencies || !b.IsSensitive || (viewSensitive && userAgencies.Contains(b.AgencyId))));

            var pfactory = new NetTopologySuite.Geometries.GeometryFactory();
            var ring = new NetTopologySuite.Geometries.LinearRing(
                new[] {
                        new NetTopologySuite.Geometries.Coordinate(neLong, neLat),
                        new NetTopologySuite.Geometries.Coordinate(swLong, neLat),
                        new NetTopologySuite.Geometries.Coordinate(swLong, swLat),
                        new NetTopologySuite.Geometries.Coordinate(neLong, swLat),
                        new NetTopologySuite.Geometries.Coordinate(neLong, neLat)
                });
            var poly = pfactory.CreatePolygon(ring);
            poly.SRID = 4326;
            query = query.Where(p => poly.Contains(p.Location));

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
            var userAgencies = this.User.GetAgenciesAsNullable(); ;
            var viewSensitive = this.User.HasPermission(Permissions.SensitiveView);
            var isAdmin = this.User.HasPermission(Permissions.AdminProperties);

            var building = this.Context.Buildings
                .Include(p => p.Parcels).ThenInclude(pb => pb.Parcel)
                .Include(p => p.BuildingPredominateUse)
                .Include(p => p.BuildingConstructionType)
                .Include(p => p.BuildingOccupantType)
                .Include(p => p.Address).ThenInclude(a => a.Province)
                .Include(p => p.Agency).ThenInclude(a => a.Parent)
                .Include(p => p.Evaluations)
                .Include(p => p.Fiscals)
                .AsNoTracking()
                .FirstOrDefault(b => b.Id == id
                    && (isAdmin
                        || b.IsVisibleToOtherAgencies
                        || ((!b.IsSensitive || viewSensitive)
                            && userAgencies.Contains(b.AgencyId)))) ?? throw new KeyNotFoundException();

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

            var agency = this.User.GetAgency(this.Context) ??
                throw new NotAuthorizedException("User must belong to an agency before adding buildings.");

            // A building should have a unique name within the parcel it is located on.
            building.Parcels.ForEach(pb => this.Context.ThrowIfNotUnique(pb.Parcel, building));

            building.AgencyId = agency.Id;
            building.Agency = agency;
            building.IsVisibleToOtherAgencies = false;
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
            building.ThrowIfNotAllowedToEdit(nameof(building), this.User, new[] { Permissions.PropertyEdit, Permissions.AdminProperties });
            var isAdmin = this.User.HasPermission(Permissions.AdminProperties);

            var existingBuilding = this.Context.Buildings.Find(building.Id) ?? throw new KeyNotFoundException();
            this.ThrowIfNotAllowedToUpdate(existingBuilding, _options.Project);

            var userAgencies = this.User.GetAgenciesAsNullable(); ;
            if (!isAdmin && !userAgencies.Contains(existingBuilding.AgencyId)) throw new NotAuthorizedException("User may not edit buildings outside of their agency.");

            // Do not allow switching agencies through this method.
            if (existingBuilding.AgencyId != building.AgencyId && !isAdmin) throw new NotAuthorizedException("Building cannot be transferred to the specified agency.");

            // Do not allow making property visible through this service.
            if (existingBuilding.IsVisibleToOtherAgencies != building.IsVisibleToOtherAgencies) throw new InvalidOperationException("Building cannot be made visible to other agencies through this service.");

            // Only administrators can dispose a property.
            if (building.ClassificationId == 4 && !isAdmin) throw new NotAuthorizedException("Building classification cannot be changed to disposed.");

            // A building should have a unique name within the parcel it is located on.
            existingBuilding.Parcels.ForEach(pb => this.Context.ThrowIfNotUnique(pb.Parcel, building));

            this.Context.Entry(existingBuilding).CurrentValues.SetValues(building);

            // update only an active project with any financial value changes.
            if (!String.IsNullOrWhiteSpace(existingBuilding.ProjectNumber) && (!this.Context.Projects.Include(p => p.Status).FirstOrDefault(p => p.ProjectNumber == existingBuilding.ProjectNumber)?.IsProjectClosed() ?? false))
            {
                this.Context.UpdateProjectFinancials(existingBuilding.ProjectNumber);
            }

            this.Context.Buildings.Update(existingBuilding); // TODO: Must detach entity before returning it.
            this.Context.CommitTransaction();
            return existingBuilding;
        }

        /// <summary>
        /// Remove the specified building from the datasource.
        /// </summary>
        /// <param name="building"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public void Remove(Building building)
        {
            building.ThrowIfNotAllowedToEdit(nameof(building), this.User, new[] { Permissions.PropertyEdit, Permissions.AdminProperties });
            var isAdmin = this.User.HasPermission(Permissions.AdminProperties);

            var existingBuilding = this.Context.Buildings.Find(building.Id) ?? throw new KeyNotFoundException();

            var agency_ids = this.User.GetAgenciesAsNullable(); ;
            if (!isAdmin && !agency_ids.Contains(existingBuilding.AgencyId)) throw new NotAuthorizedException("User may not remove buildings outside of their agency.");

            this.Context.Entry(existingBuilding).CurrentValues.SetValues(building);

            this.Context.Buildings.Remove(existingBuilding); // TODO: Shouldn't be allowed to permanently delete buildings entirely.
            this.Context.CommitTransaction();
        }
        #endregion
    }
}
