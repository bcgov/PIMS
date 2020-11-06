using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
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
    /// ParcelService class, provides a service layer to interact with parcels within the datasource.
    /// </summary>
    public class ParcelService : BaseService<Parcel>, IParcelService
    {
        #region Variables
        private readonly PimsOptions _options;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ParcelService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="options"></param>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="service"></param>
        /// <param name="logger"></param>
        public ParcelService(IOptions<PimsOptions> options, PimsContext dbContext, ClaimsPrincipal user, IPimsService service, ILogger<ParcelService> logger) : base(dbContext, user, service, logger)
        {
            _options = options.Value;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Get an array of parcels within the specified filter.
        /// Will not return sensitive parcels unless the user has the `sensitive-view` claim and belongs to the owning agency.
        /// </summary>
        /// <param name="neLat"></param>
        /// <param name="neLong"></param>
        /// <param name="swLat"></param>
        /// <param name="swLong"></param>
        /// <returns></returns>
        public IEnumerable<Parcel> Get(double neLat, double neLong, double swLat, double swLong)
        {
            this.User.ThrowIfNotAuthorized(Permissions.PropertyView);
            // Check if user has the ability to view sensitive properties.
            var userAgencies = this.User.GetAgenciesAsNullable();
            var viewSensitive = this.User.HasPermission(Security.Permissions.SensitiveView);
            var isAdmin = this.User.HasPermission(Permissions.AdminProperties);

            // Users may only view sensitive properties if they have the `sensitive-view` claim and belong to the owning agency.
            var query = this.Context.Parcels.AsNoTracking().Where(p =>
                (isAdmin
                    || p.IsVisibleToOtherAgencies
                    || ((!p.IsSensitive || viewSensitive)
                        && userAgencies.Contains(p.AgencyId))));

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
        /// Get an array of parcels within the specified filter.
        /// Will not return sensitive parcels unless the user has the `sensitive-view` claim and belongs to the owning agency.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public IEnumerable<Parcel> Get(ParcelFilter filter)
        {
            this.User.ThrowIfNotAuthorized(Permissions.PropertyView);
            var query = this.Context.GenerateQuery(this.User, filter);

            return query.ToArray();
        }

        /// <summary>
        /// Get an array of parcels within the specified filter.
        /// Will not return sensitive parcels unless the user has the `sensitive-view` claim and belongs to the owning agency.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public Paged<Parcel> GetPage(ParcelFilter filter)
        {
            this.User.ThrowIfNotAuthorized(Permissions.PropertyView);

            var query = this.Context.GenerateQuery(this.User, filter);
            var total = query.Count();
            var items = query.Skip((filter.Page - 1) * filter.Quantity).Take(filter.Quantity);

            return new Paged<Parcel>(items, filter.Page, filter.Quantity, total);
        }

        /// <summary>
        /// Get the parcel for the specified 'id'.
        /// Will not return sensitive buildings unless the user has the `sensitive-view` claim and belongs to the owning agency.
        /// </summary>
        /// <param name="id"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public Parcel Get(int id)
        {
            this.User.ThrowIfNotAuthorized(Permissions.PropertyView);
            // Check if user has the ability to view sensitive properties.
            var userAgencies = this.User.GetAgenciesAsNullable();
            var viewSensitive = this.User.HasPermission(Permissions.SensitiveView);
            var isAdmin = this.User.HasPermission(Permissions.AdminProperties);

            var ownsABuilding = this.Context.ParcelBuildings
                .Any(pb => pb.ParcelId == id
                    && userAgencies.Contains(pb.Building.AgencyId));

            var parcel = this.Context.Parcels
                .AsNoTracking()
                .Include(p => p.Classification)
                .Include(p => p.Address)
                .Include(p => p.Address.Province)
                .Include(p => p.Agency)
                .Include(p => p.Agency.Parent)
                .Include(p => p.Evaluations)
                .Include(p => p.Fiscals)
                .Include(p => p.Buildings)
                .Include(p => p.CreatedBy)
                .Include(p => p.UpdatedBy)
                .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.Address)
                .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.Address.Province)
                .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.BuildingConstructionType)
                .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.BuildingPredominateUse)
                .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.BuildingOccupantType)
                .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.Evaluations)
                .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.Fiscals)
                .FirstOrDefault(p => p.Id == id
                    && (ownsABuilding || isAdmin || p.IsVisibleToOtherAgencies || !p.IsSensitive || (viewSensitive && userAgencies.Contains(p.AgencyId)))) ?? throw new KeyNotFoundException();

            // Remove any sensitive buildings from the results if the user is not allowed to view them.
            if (!viewSensitive)
            {
                parcel?.Buildings.RemoveAll(pb => pb.Building.IsSensitive);
            }

            // Remove any properties not owned by user's agency.
            if (!isAdmin)
            {
                parcel?.Buildings.RemoveAll(pb => !userAgencies.Contains(pb.Building.AgencyId));
            }

            return parcel;
        }

        /// <summary>
        /// Add the specified parcel to the datasource.
        /// </summary>
        /// <param name="parcel"></param>
        /// <returns></returns>
        public Parcel Add(Parcel parcel)
        {
            parcel.ThrowIfNull(nameof(parcel));
            this.User.ThrowIfNotAuthorized(Permissions.PropertyAdd);

            var agency = this.User.GetAgency(this.Context) ??
                throw new NotAuthorizedException("User must belong to an agency before adding parcels.");

            this.Context.Parcels.ThrowIfNotUnique(parcel);

            parcel.AgencyId = agency.Id;
            parcel.Agency = agency;
            parcel.Address.Province = this.Context.Provinces.Find(parcel.Address.ProvinceId);
            parcel.Classification = this.Context.PropertyClassifications.Find(parcel.ClassificationId);
            parcel.IsVisibleToOtherAgencies = false;

            parcel.Buildings.ForEach(pb =>
            {
                pb.Parcel = parcel;
                pb.Building.Address.AdministrativeArea = parcel.Address.AdministrativeArea;
                pb.Building.Address.Province = this.Context.Provinces.Find(parcel.Address.ProvinceId);
                pb.Building.Classification = this.Context.PropertyClassifications.Find(parcel.ClassificationId);
                pb.Building.BuildingConstructionType = this.Context.BuildingConstructionTypes.Find(pb.Building.BuildingConstructionTypeId);
                pb.Building.BuildingOccupantType = this.Context.BuildingOccupantTypes.Find(pb.Building.BuildingOccupantTypeId);
                pb.Building.BuildingPredominateUse = this.Context.BuildingPredominateUses.Find(pb.Building.BuildingPredominateUseId);

            });

            this.Context.Parcels.Add(parcel);
            this.Context.CommitTransaction();
            return parcel;
        }

        /// <summary>
        /// Update the specified parcel in the datasource.
        /// </summary>
        /// <param name="parcel"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public Parcel Update(Parcel parcel)
        {
            parcel.ThrowIfNotAllowedToEdit(nameof(parcel), this.User, new[] { Permissions.PropertyEdit, Permissions.AdminProperties });
            var isAdmin = this.User.HasPermission(Permissions.AdminProperties);

            var originalParcel = this.Context.Parcels
                .Include(p => p.Agency)
                .Include(p => p.Address)
                .Include(p => p.Evaluations)
                .Include(p => p.Fiscals)
                .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.Evaluations)
                .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.Fiscals)
                .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.Address)
                .SingleOrDefault(p => p.Id == parcel.Id) ?? throw new KeyNotFoundException();

            var userAgencies = this.User.GetAgencies();
            var originalAgencyId = (int)this.Context.Entry(originalParcel).OriginalValues[nameof(Parcel.AgencyId)];
            var allowEdit = isAdmin || userAgencies.Contains(originalAgencyId);
            var ownsABuilding = originalParcel.Buildings.Any(pb => userAgencies.Contains(pb.Building.AgencyId.Value));
            if (!allowEdit && !ownsABuilding) throw new NotAuthorizedException("User may not edit parcels outside of their agency.");

            // Do not allow switching agencies through this method.
            if (!isAdmin && originalAgencyId != parcel.AgencyId) throw new NotAuthorizedException("Parcel cannot be transferred to the specified agency.");

            // Do not allow making property visible through this service.
            if (originalParcel.IsVisibleToOtherAgencies != parcel.IsVisibleToOtherAgencies) throw new InvalidOperationException("Parcel cannot be made visible to other agencies through this service.");

            // Only administrators can dispose a property.
            if (!isAdmin && parcel.ClassificationId == 4) throw new NotAuthorizedException("Parcel classification cannot be changed to disposed.");

            // Update a parcel and all child collections
            this.ThrowIfNotAllowedToUpdate(originalParcel, _options.Project);

            // Users who don't own the parcel, but only own a building cannot update the parcel.

            if (allowEdit)
            {
                this.Context.Entry(originalParcel).CurrentValues.SetValues(parcel);
                this.Context.Entry(originalParcel.Address).CurrentValues.SetValues(parcel.Address);
                this.Context.SetOriginalRowVersion(originalParcel);
            }

            foreach (var building in parcel.Buildings.Select(pb => pb.Building))
            {
                // Check if the buildig already exists.
                var existingBuilding = originalParcel.Buildings
                    .FirstOrDefault(pb => pb.BuildingId == building.Id)?.Building;

                // Reset all relationships that are not changed through this update.
                building.Address.Province = this.Context.Provinces.FirstOrDefault(p => p.Id == building.Address.ProvinceId);
                building.BuildingConstructionType = this.Context.BuildingConstructionTypes.FirstOrDefault(b => b.Id == building.BuildingConstructionTypeId);
                building.BuildingOccupantType = this.Context.BuildingOccupantTypes.FirstOrDefault(b => b.Id == building.BuildingOccupantTypeId);
                building.BuildingPredominateUse = this.Context.BuildingPredominateUses.FirstOrDefault(b => b.Id == building.BuildingPredominateUseId);
                building.Agency = this.Context.Agencies.FirstOrDefault(a => a.Id == building.AgencyId);

                if (existingBuilding == null)
                {
                    if (!allowEdit) throw new NotAuthorizedException("User may not add properties to a parcel they don't own.");

                    originalParcel.Buildings.Add(new ParcelBuilding(parcel, building));
                }
                else
                {
                    this.ThrowIfNotAllowedToUpdate(existingBuilding, _options.Project);

                    if (!allowEdit && !userAgencies.Contains(existingBuilding.AgencyId.Value)) throw new NotAuthorizedException("User may not update a property they don't own.");
                    // Do not allow switching agencies through this method.
                    if (!isAdmin && existingBuilding.AgencyId != building.AgencyId) throw new NotAuthorizedException("Building cannot be transferred to the specified agency.");

                    this.Context.Entry(existingBuilding).CurrentValues.SetValues(building);
                    this.Context.Entry(existingBuilding.Address).CurrentValues.SetValues(building.Address);
                    var updateProject = false;
                    foreach (var buildingEvaluation in building.Evaluations)
                    {
                        var existingBuildingEvaluation = existingBuilding.Evaluations
                            .FirstOrDefault(e => e.Date == buildingEvaluation.Date && e.Key == buildingEvaluation.Key);

                        var updateEvaluation = existingBuildingEvaluation?.Value != buildingEvaluation.Value;
                        updateProject = updateProject || updateEvaluation;
                        if (existingBuildingEvaluation == null)
                        {
                            existingBuilding.Evaluations.Add(buildingEvaluation);
                        }
                        else if (updateEvaluation)
                        {
                            this.Context.Entry(existingBuildingEvaluation).CurrentValues.SetValues(buildingEvaluation);
                        }
                    }
                    foreach (var buildingFiscal in building.Fiscals)
                    {
                        this.Context.Entry(existingBuilding).CurrentValues.SetValues(building);
                        this.Context.Entry(existingBuilding.Address).CurrentValues.SetValues(building.Address);

                        var existingBuildingFiscal = existingBuilding.Fiscals
                            .FirstOrDefault(e => e.FiscalYear == buildingFiscal.FiscalYear && e.Key == buildingFiscal.Key);

                        var updateFiscal = existingBuildingFiscal?.Value != buildingFiscal.Value;
                        updateProject = updateProject || updateFiscal;
                        if (existingBuildingFiscal == null)
                        {
                            existingBuilding.Fiscals.Add(buildingFiscal);
                        }
                        else if (updateFiscal)
                        {
                            this.Context.Entry(existingBuildingFiscal).CurrentValues.SetValues(buildingFiscal);
                        }
                    }

                    // update only an active project with any financial value changes.
                    if (updateProject && !String.IsNullOrWhiteSpace(existingBuilding.ProjectNumber) && (!this.Context.Projects.Include(p => p.Status).FirstOrDefault(p => p.ProjectNumber == existingBuilding.ProjectNumber)?.IsProjectClosed() ?? false))
                    {
                        this.Context.UpdateProjectFinancials(existingBuilding.ProjectNumber);
                    }
                }
            }

            if (allowEdit)
            {
                foreach (var parcelEvaluation in parcel.Evaluations)
                {
                    var existingEvaluation = originalParcel.Evaluations
                        .FirstOrDefault(e => e.Date == parcelEvaluation.Date && e.Key == parcelEvaluation.Key);

                    if (existingEvaluation == null)
                    {
                        originalParcel.Evaluations.Add(parcelEvaluation);
                    }
                    else
                    {
                        this.Context.Entry(existingEvaluation).CurrentValues.SetValues(parcelEvaluation);
                    }
                }
                foreach (var parcelFiscal in parcel.Fiscals)
                {
                    var originalParcelFiscal = originalParcel.Fiscals
                        .FirstOrDefault(e => e.FiscalYear == parcelFiscal.FiscalYear && e.Key == parcelFiscal.Key);

                    if (originalParcelFiscal == null)
                    {
                        originalParcel.Fiscals.Add(parcelFiscal);
                    }
                    else
                    {
                        this.Context.Entry(originalParcelFiscal).CurrentValues.SetValues(parcelFiscal);
                    }
                }

                // Go through the existing buildings and see if they have been deleted from the updated parcel.
                // If they have been removed, delete them from the datasource.
                foreach (var parcelBuilding in originalParcel.Buildings)
                {
                    var updateBuilding = parcel.Buildings.FirstOrDefault(pb => pb.BuildingId == parcelBuilding.BuildingId);
                    if (updateBuilding == null)
                    {
                        // TODO: This will delete the building from the datasource.  This isn't entirely ideal as it may be related to multiple parcels.
                        this.ThrowIfNotAllowedToUpdate(parcelBuilding.Building, _options.Project);

                        var parcelBuildings = this.Context.ParcelBuildings.Where(pb => pb.BuildingId == parcelBuilding.BuildingId).ToArray();
                        parcelBuildings.ForEach(pb => this.Context.ParcelBuildings.Remove(pb)); // Remove all relationships from other parcels to this building.
                        this.Context.Buildings.Remove(parcelBuilding.Building);
                        parcel.Buildings.Remove(parcelBuilding);

                        continue;
                    }

                    // The building may have evaluations or fiscals that need to be deleted.
                    foreach (var buildingEvaluation in parcelBuilding.Building.Evaluations)
                    {
                        // Delete the evaluations that have been removed.
                        if (!updateBuilding.Building.Evaluations.Any(e => (e.BuildingId == buildingEvaluation.BuildingId && e.Date == buildingEvaluation.Date && e.Key == buildingEvaluation.Key)))
                        {
                            this.Context.BuildingEvaluations.Remove(buildingEvaluation);
                        }
                    }
                    foreach (var buildingFiscal in parcelBuilding.Building.Fiscals)
                    {
                        // Delete the fiscals that have been removed.
                        if (!updateBuilding.Building.Fiscals.Any(e => (e.BuildingId == buildingFiscal.BuildingId && e.FiscalYear == buildingFiscal.FiscalYear && e.Key == buildingFiscal.Key)))
                        {
                            this.Context.BuildingFiscals.Remove(buildingFiscal);
                        }
                    }
                }

                foreach (var parcelEvaluation in originalParcel.Evaluations)
                {
                    // Delete the evaluations from the parcel that have been removed.
                    if (!parcel.Evaluations.Any(e => (e.ParcelId == parcelEvaluation.ParcelId && e.Date == parcelEvaluation.Date && e.Key == parcelEvaluation.Key)))
                    {
                        this.Context.ParcelEvaluations.Remove(parcelEvaluation);
                    }
                }
                foreach (var parcelFiscals in originalParcel.Fiscals)
                {
                    // Delete the fiscals from the parcel that have been removed.
                    if (!parcel.Fiscals.Any(e => (e.ParcelId == parcelFiscals.ParcelId && e.FiscalYear == parcelFiscals.FiscalYear && e.Key == parcelFiscals.Key)))
                    {
                        this.Context.ParcelFiscals.Remove(parcelFiscals);
                    }
                }

                // update only an active project with any financial value changes.
                if (!String.IsNullOrWhiteSpace(parcel.ProjectNumber)
                    && (!this.Context.Projects.Include(p => p.Status).FirstOrDefault(p => p.ProjectNumber == parcel.ProjectNumber)?.IsProjectClosed() ?? false))
                {
                    this.Context.UpdateProjectFinancials(parcel.ProjectNumber);
                }
            }

            this.Context.SaveChanges();
            this.Context.CommitTransaction();
            return parcel;
        }

        /// <summary>
        /// Remove the specified parcel from the datasource.
        /// </summary>
        /// <param name="parcel"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public void Remove(Parcel parcel)
        {
            parcel.ThrowIfNotAllowedToEdit(nameof(parcel), this.User, new[] { Permissions.PropertyDelete, Permissions.AdminProperties });

            var userAgencies = this.User.GetAgenciesAsNullable();
            var viewSensitive = this.User.HasPermission(Permissions.SensitiveView);
            var isAdmin = this.User.HasPermission(Permissions.AdminProperties);
            var originalParcel = this.Context.Parcels
                .Include(p => p.Agency)
                .Include(p => p.Address)
                .Include(p => p.Evaluations)
                .Include(p => p.Fiscals)
                .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.Evaluations)
                .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.Fiscals)
                .Include(p => p.Buildings).ThenInclude(pb => pb.Building).ThenInclude(b => b.Address)
                .SingleOrDefault(u => u.Id == parcel.Id) ?? throw new KeyNotFoundException();

            if (!isAdmin && (!userAgencies.Contains(originalParcel.AgencyId) || originalParcel.IsSensitive && !viewSensitive))
                throw new NotAuthorizedException("User does not have permission to delete.");

            this.ThrowIfNotAllowedToUpdate(originalParcel, _options.Project);
            this.Context.Entry(originalParcel).CurrentValues.SetValues(parcel);
            this.Context.SetOriginalRowVersion(originalParcel);

            originalParcel.Buildings.ForEach(b =>
            {
                this.ThrowIfNotAllowedToUpdate(b.Building, _options.Project);
                this.Context.ParcelBuildings.Remove(b);
                this.Context.BuildingEvaluations.RemoveRange(b.Building.Evaluations);
                this.Context.BuildingFiscals.RemoveRange(b.Building.Fiscals);
                this.Context.Buildings.Remove(b.Building);
            });
            this.Context.ParcelEvaluations.RemoveRange(originalParcel.Evaluations);
            this.Context.ParcelFiscals.RemoveRange(originalParcel.Fiscals);
            this.Context.Parcels.Remove(originalParcel); // TODO: Shouldn't be allowed to permanently delete parcels entirely under certain conditions.
            this.Context.CommitTransaction();
        }

        public bool IsPidAvailable(int parcelId, int PID)
        {
            return !Context.Parcels.Any(parcel => parcel.PID == PID && parcel.Id != parcelId);
        }

        public bool IsPinAvailable(int parcelId, int PIN)
        {
            return !Context.Parcels.Any(parcel => parcel.PIN == PIN && parcel.Id != parcelId);
        }

        #endregion
    }
}
