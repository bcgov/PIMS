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
        private readonly IPimsService _service;
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
            _service = service;
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
                .Include(b => b.Parcels).ThenInclude(pb => pb.Parcel).ThenInclude(b => b.Evaluations)
                .Include(b => b.Parcels).ThenInclude(pb => pb.Parcel).ThenInclude(b => b.Fiscals)
                .Include(b => b.Parcels).ThenInclude(pb => pb.Parcel).ThenInclude(b => b.Address).ThenInclude(a => a.Province)
                .Include(b => b.Parcels).ThenInclude(pb => pb.Parcel).ThenInclude(b => b.Classification)
                .Include(b => b.Classification)
                .Include(p => p.BuildingPredominateUse)
                .Include(p => p.BuildingConstructionType)
                .Include(p => p.BuildingOccupantType)
                .Include(p => p.Address).ThenInclude(a => a.Province)
                .Include(p => p.Agency).ThenInclude(a => a.Parent)
                .Include(p => p.Evaluations)
                .Include(p => p.Fiscals)
                .Include(p => p.UpdatedBy)
                .Include(p => p.Projects).ThenInclude(pp => pp.Project).ThenInclude(p => p.Workflow)
                .Include(p => p.Projects).ThenInclude(pp => pp.Project).ThenInclude(p => p.Status)
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
            // SRES users allowed to overwrite
            if (!this.User.HasPermission(Permissions.AdminProperties))
            {
                building.AgencyId = agency.Id;
                building.Agency = agency;
            }

            building.PropertyTypeId = (int)PropertyTypes.Building;
            building.Address.Province = this.Context.Provinces.Find(building.Address.ProvinceId);
            building.Classification = this.Context.PropertyClassifications.Find(building.ClassificationId);
            building.IsVisibleToOtherAgencies = false;

            building.Parcels.ForEach(bp =>
            {
                bp.Building = building;
                //The Parcel may already exist, if it does update the existing parcel.
                if (bp.ParcelId > 0)
                {
                    _service.Parcel.PendingUpdate(bp.Parcel);
                    bp.Parcel = null;
                }
                else
                {
                    bp.Parcel.Address.Province = this.Context.Provinces.Find(building.Address.ProvinceId);
                    bp.Parcel.Classification = this.Context.PropertyClassifications.Find(building.ClassificationId);
                    bp.Parcel.Address.AdministrativeArea = building.Address.AdministrativeArea;
                }
            });

            this.Context.Buildings.Add(building);
            this.Context.CommitTransaction();
            return Get(building.Id);
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

            var existingBuilding = this.Context.Buildings
                .Include(b => b.Agency)
                .Include(b => b.Address).ThenInclude(a => a.Province)
                .Include(b => b.Evaluations)
                .Include(b => b.Fiscals)
                .Include(b => b.Parcels).ThenInclude(pb => pb.Parcel).ThenInclude(b => b.Buildings)
                .Include(b => b.Parcels).ThenInclude(pb => pb.Parcel).ThenInclude(b => b.Evaluations)
                .Include(b => b.Parcels).ThenInclude(pb => pb.Parcel).ThenInclude(b => b.Classification)
                .Include(b => b.Parcels).ThenInclude(pb => pb.Parcel).ThenInclude(b => b.Fiscals)
                .Include(b => b.Parcels).ThenInclude(pb => pb.Parcel).ThenInclude(b => b.Address).ThenInclude(a => a.Province)
                .FirstOrDefault(b => b.Id == building.Id) ?? throw new KeyNotFoundException();

            var userAgencies = this.User.GetAgenciesAsNullable();
            if (!isAdmin && !userAgencies.Contains(existingBuilding.AgencyId)) throw new NotAuthorizedException("User may not edit buildings outside of their agency.");

            existingBuilding.ThrowIfPropertyInSppProject(this.User);

            // Do not allow switching agencies through this method.
            if (existingBuilding.AgencyId != building.AgencyId && !isAdmin) throw new NotAuthorizedException("Building cannot be transferred to the specified agency.");

            // Do not allow making property visible through this service.
            if (existingBuilding.IsVisibleToOtherAgencies != building.IsVisibleToOtherAgencies) throw new InvalidOperationException("Building cannot be made visible to other agencies through this service.");

            // Only administrators can dispose a property.
            if (building.ClassificationId == (int)ClassificationTypes.Disposed && !isAdmin) throw new NotAuthorizedException("Building classification cannot be changed to disposed.");

            // Only administrators can set a building to demolished
            if (building.ClassificationId == (int)ClassificationTypes.Demolished && !isAdmin) throw new NotAuthorizedException("Building classification cannot be changed to demolished.");

            // Only administrators can set property to subdivided
            if (building.ClassificationId == (int)ClassificationTypes.Subdivided && !isAdmin) throw new NotAuthorizedException("Building classification cannot be changed to subdivided.");

            var allowEdit = isAdmin || userAgencies.Contains(existingBuilding.AgencyId);
            // A building should have a unique name within the parcel it is located on.
            existingBuilding.Parcels.ForEach(pb => this.Context.ThrowIfNotUnique(pb.Parcel, building));

            foreach (var parcel in building.Parcels.Select(pb => pb.Parcel))
            {
                // Check if the parcel already exists.
                var existingAssociatedParcel = existingBuilding.Parcels
                    .FirstOrDefault(pb => pb.ParcelId == parcel.Id)?.Parcel;

                // Reset all relationships that are not changed through this update.
                parcel.Address.Province = this.Context.Provinces.FirstOrDefault(p => p.Id == parcel.Address.ProvinceId);
                parcel.Classification = this.Context.PropertyClassifications.FirstOrDefault(b => b.Id == parcel.ClassificationId);
                parcel.Agency = this.Context.Agencies.FirstOrDefault(a => a.Id == building.AgencyId);

                if (existingAssociatedParcel == null)
                {
                    if (!allowEdit) throw new NotAuthorizedException("User may not add parcels to a property they don't own.");
                    var existingParcel = this.Context.Parcels
                    .Include(p => p.Buildings)
                    .FirstOrDefault(pb => pb.Id == parcel.Id);
                    if (existingParcel != null)
                    {
                        parcel.Buildings.Clear(); // Do not modify the list of buildings associated to parcels when performing building updates.
                        existingParcel.Buildings.ForEach(building => parcel.Buildings.Add(building));
                        _service.Parcel.PendingUpdate(parcel);
                    }

                    existingBuilding.Parcels.Add(new ParcelBuilding(existingParcel ?? parcel, building));
                }
                else
                {
                    parcel.Buildings.Clear(); // Do not modify the list of buildings associated to parcels when performing building updates.
                    existingAssociatedParcel.Buildings.ForEach(building => parcel.Buildings.Add(building));
                    _service.Parcel.PendingUpdate(parcel);
                }
            }

            if (allowEdit)
            {
                building.PropertyTypeId = existingBuilding.PropertyTypeId;
                this.Context.Entry(existingBuilding.Address).CurrentValues.SetValues(building.Address);
                this.Context.Entry(existingBuilding).CurrentValues.SetValues(building);
                this.Context.SetOriginalRowVersion(existingBuilding);
                this.Context.UpdateBuildingFinancials(existingBuilding, building.Evaluations, building.Fiscals);

                // Go through the existing parcels and see if they have been deleted from the updated buildings.
                foreach (var parcelBuilding in existingBuilding.Parcels)
                {
                    var updateParcel = building.Parcels.FirstOrDefault(pb => pb.ParcelId == parcelBuilding.ParcelId);
                    if (updateParcel == null)
                    {
                        this.ThrowIfNotAllowedToUpdate(parcelBuilding.Building, _options.Project);

                        building.Parcels.Remove(parcelBuilding);
                        this.Context.ParcelBuildings.Remove(parcelBuilding);

                        continue;
                    }

                    // The parcel may have evaluations or fiscals that need to be deleted.
                    foreach (var parcelEvaluation in parcelBuilding.Parcel.Evaluations)
                    {
                        // Delete the evaluations that have been removed.
                        if (!updateParcel.Parcel.Evaluations.Any(e => (e.ParcelId == parcelEvaluation.ParcelId && e.Date == parcelEvaluation.Date && e.Key == parcelEvaluation.Key)))
                        {
                            this.Context.ParcelEvaluations.Remove(parcelEvaluation);
                        }
                    }
                    foreach (var parcelFiscal in parcelBuilding.Parcel.Fiscals)
                    {
                        // Delete the fiscals that have been removed.
                        if (!updateParcel.Parcel.Fiscals.Any(e => (e.ParcelId == parcelFiscal.ParcelId && e.FiscalYear == parcelFiscal.FiscalYear && e.Key == parcelFiscal.Key)))
                        {
                            this.Context.ParcelFiscals.Remove(parcelFiscal);
                        }
                    }
                }

                foreach (var buildingEvaluation in existingBuilding.Evaluations)
                {
                    // Delete the evaluations from the parcel that have been removed.
                    if (!building.Evaluations.Any(e => (e.BuildingId == buildingEvaluation.BuildingId && e.Date == buildingEvaluation.Date && e.Key == buildingEvaluation.Key)))
                    {
                        this.Context.BuildingEvaluations.Remove(buildingEvaluation);
                    }
                }
                foreach (var buildingFiscals in existingBuilding.Fiscals)
                {
                    // Delete the fiscals from the parcel that have been removed.
                    if (!building.Fiscals.Any(e => (e.BuildingId == buildingFiscals.BuildingId && e.FiscalYear == buildingFiscals.FiscalYear && e.Key == buildingFiscals.Key)))
                    {
                        this.Context.BuildingFiscals.Remove(buildingFiscals);
                    }
                }
            }
            existingBuilding.LeasedLandMetadata = building.LeasedLandMetadata;
            this.Context.Buildings.Update(existingBuilding); // TODO: Must detach entity before returning it.
            this.Context.CommitTransaction();
            return Get(existingBuilding.Id);
        }

        /// <summary>
        /// Update the specified building financials in the datasource.
        /// </summary>
        /// <param name="building"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public Building UpdateFinancials(Building building)
        {
            building.ThrowIfNotAllowedToEdit(nameof(building), this.User,
                new[] { Permissions.PropertyEdit, Permissions.AdminProperties });
            var isAdmin = this.User.HasPermission(Permissions.AdminProperties);

            var existingBuilding = this.Context.Buildings
                .Include(b => b.Evaluations)
                .Include(b => b.Fiscals)
                .FirstOrDefault(b => b.Id == building.Id) ?? throw new KeyNotFoundException();
            this.ThrowIfNotAllowedToUpdate(existingBuilding, _options.Project);

            var userAgencies = this.User.GetAgenciesAsNullable();
            if (!isAdmin && !userAgencies.Contains(existingBuilding.AgencyId))
                throw new NotAuthorizedException("User may not edit buildings outside of their agency.");

            existingBuilding.ThrowIfPropertyInSppProject(this.User);

            var allowEdit = isAdmin || userAgencies.Contains(existingBuilding.AgencyId);
            if (allowEdit)
            {
                this.Context.SetOriginalRowVersion(existingBuilding);
                this.Context.UpdateBuildingFinancials(existingBuilding, building.Evaluations, building.Fiscals);
            }

            this.Context.SaveChanges();
            this.Context.CommitTransaction();
            return Get(existingBuilding.Id);
        }

        /// <summary>
        /// Remove the specified building from the datasource.
        /// </summary>
        /// <param name="building"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public void Remove(Building building)
        {
            building.ThrowIfNotAllowedToEdit(nameof(building), this.User, new[] { Permissions.PropertyDelete, Permissions.AdminProperties });
            var isAdmin = this.User.HasPermission(Permissions.AdminProperties);

            var existingBuilding = this.Context.Buildings.Include(b => b.Evaluations).Include(b => b.Fiscals).Include(b => b.Parcels).FirstOrDefault(b => b.Id == building.Id) ?? throw new KeyNotFoundException();

            var agency_ids = this.User.GetAgenciesAsNullable(); ;
            if (!isAdmin && !agency_ids.Contains(existingBuilding.AgencyId)) throw new NotAuthorizedException("User may not remove buildings outside of their agency.");

            existingBuilding.ThrowIfPropertyInSppProject(this.User);

            existingBuilding.RowVersion = building.RowVersion;
            this.Context.SetOriginalRowVersion(existingBuilding);

            existingBuilding.Parcels.Clear();
            existingBuilding.Evaluations.Clear();
            existingBuilding.Fiscals.Clear();

            this.Context.Buildings.Remove(existingBuilding); // TODO: Should track deletion of property through archiveing or logging.
            this.Context.CommitTransaction();
        }
        #endregion
    }
}
