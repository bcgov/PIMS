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
                        && userAgencies.Contains(p.AgencyId)))
                && p.Latitude != 0
                && p.Longitude != 0
                && p.Latitude <= neLat
                && p.Latitude >= swLat
                && p.Longitude <= neLong
                && p.Longitude >= swLong);
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

            var parcel = this.Context.Parcels
                .Include(p => p.Status)
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
                .Include(p => p.Buildings).ThenInclude(b => b.Evaluations)
                .Include(p => p.Buildings).ThenInclude(b => b.Fiscals)
                .AsNoTracking()
                .FirstOrDefault(p => p.Id == id &&
                    (isAdmin || p.IsVisibleToOtherAgencies || !p.IsSensitive || (viewSensitive && userAgencies.Contains(p.AgencyId)))) ?? throw new KeyNotFoundException();

            // Remove any sensitive buildings from the results if the user is not allowed to view them.
            parcel?.Buildings.RemoveAll(b => !isAdmin && b.IsSensitive && !userAgencies.Contains(b.AgencyId));
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
            parcel.Address.City = this.Context.Cities.Find(parcel.Address.CityId);
            parcel.Address.Province = this.Context.Provinces.Find(parcel.Address.ProvinceId);
            parcel.Status = this.Context.PropertyStatus.Find(parcel.StatusId);
            parcel.Classification = this.Context.PropertyClassifications.Find(parcel.ClassificationId);
            parcel.IsVisibleToOtherAgencies = false;

            parcel.Buildings.ForEach(b =>
            {
                b.Parcel = parcel;
                b.Address.City = this.Context.Cities.Find(parcel.Address.CityId);
                b.Address.Province = this.Context.Provinces.Find(parcel.Address.ProvinceId);
                b.Status = this.Context.PropertyStatus.Find(parcel.StatusId);
                b.Classification = this.Context.PropertyClassifications.Find(parcel.ClassificationId);
                b.BuildingConstructionType = this.Context.BuildingConstructionTypes.Find(b.BuildingConstructionTypeId);
                b.BuildingOccupantType = this.Context.BuildingOccupantTypes.Find(b.BuildingOccupantTypeId);
                b.BuildingPredominateUse = this.Context.BuildingPredominateUses.Find(b.BuildingPredominateUseId);

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

            var existingParcel = this.Context.Parcels
                .Include(p => p.Status)
                .Include(p => p.Agency)
                .Include(p => p.Address)
                .Include(p => p.Evaluations)
                .Include(p => p.Fiscals)
                .Include(p => p.Buildings).ThenInclude(b => b.Evaluations)
                .Include(p => p.Buildings).ThenInclude(b => b.Fiscals)
                .Include(p => p.Buildings).ThenInclude(b => b.Address)
                .SingleOrDefault(p => p.Id == parcel.Id) ?? throw new KeyNotFoundException();

            var userAgencies = this.User.GetAgencies();
            var originalAgencyId = (int)this.Context.Entry(existingParcel).OriginalValues[nameof(Parcel.AgencyId)];
            if (!isAdmin && !userAgencies.Contains(originalAgencyId)) throw new NotAuthorizedException("User may not edit parcels outside of their agency.");

            // Do not allow switching agencies through this method.
            if (originalAgencyId != parcel.AgencyId && !isAdmin) throw new NotAuthorizedException("Parcel cannot be transferred to the specified agency.");

            // Do not allow making property visible through this service.
            if (existingParcel.IsVisibleToOtherAgencies != parcel.IsVisibleToOtherAgencies) throw new InvalidOperationException("Parcel cannot be made visible to other agencies through this service.");

            this.Context.Parcels.ThrowIfPidPinUpdated(parcel);

            // Update a parcel and all child collections
            this.ThrowIfNotAllowedToUpdate(existingParcel, _options.Project);
            this.Context.Entry(existingParcel).CurrentValues.SetValues(parcel);
            this.Context.Entry(existingParcel.Address).CurrentValues.SetValues(parcel.Address);
            this.Context.SetOriginalRowVersion(existingParcel);
            foreach (var building in parcel.Buildings)
            {
                var existingBuilding = existingParcel.Buildings
                    .FirstOrDefault(b => b.Id == building.Id);

                if (existingBuilding == null)
                {
                    existingParcel.Buildings.Add(building);
                }
                else
                {
                    this.ThrowIfNotAllowedToUpdate(existingBuilding, _options.Project);

                    this.Context.Entry(existingBuilding).CurrentValues.SetValues(building);
                    this.Context.Entry(existingBuilding.Address).CurrentValues.SetValues(building.Address);

                    foreach (var buildingEvaluation in building.Evaluations)
                    {
                        var existingBuildingEvaluation = existingBuilding.Evaluations
                            .FirstOrDefault(e => e.Date == buildingEvaluation.Date && e.Key == buildingEvaluation.Key);

                        if (existingBuildingEvaluation == null)
                        {
                            existingBuilding.Evaluations.Add(buildingEvaluation);
                        }
                        else
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
                        if (existingBuildingFiscal == null)
                        {
                            existingBuilding.Fiscals.Add(buildingFiscal);
                        }
                        else
                        {
                            this.Context.Entry(existingBuildingFiscal).CurrentValues.SetValues(buildingFiscal);
                        }
                    }
                }
            }
            foreach (var parcelEvaluation in parcel.Evaluations)
            {
                var existingEvaluation = existingParcel.Evaluations
                    .FirstOrDefault(e => e.Date == parcelEvaluation.Date && e.Key == parcelEvaluation.Key);

                if (existingEvaluation == null)
                {
                    existingParcel.Evaluations.Add(parcelEvaluation);
                }
                else
                {
                    this.Context.Entry(existingEvaluation).CurrentValues.SetValues(parcelEvaluation);
                }
            }
            foreach (var parcelFiscal in parcel.Fiscals)
            {
                var existingParcelFiscal = existingParcel.Fiscals
                    .FirstOrDefault(e => e.FiscalYear == parcelFiscal.FiscalYear && e.Key == parcelFiscal.Key);

                if (existingParcelFiscal == null)
                {
                    existingParcel.Fiscals.Add(parcelFiscal);
                }
                else
                {
                    this.Context.Entry(existingParcelFiscal).CurrentValues.SetValues(parcelFiscal);
                }
            }

            // Delete any missing records in child collections.
            foreach (var building in existingParcel.Buildings)
            {
                var matchingBuilding = parcel.Buildings.FirstOrDefault(b => b.Id == building.Id);
                if (matchingBuilding == null)
                {
                    this.ThrowIfNotAllowedToUpdate(building, _options.Project);
                    this.Context.Buildings.Remove(building);

                    continue;
                }
                foreach (var buildingEvaluation in building.Evaluations)
                {
                    if (!matchingBuilding.Evaluations.Any(e => (e.BuildingId == buildingEvaluation.BuildingId && e.Date == buildingEvaluation.Date && e.Key == buildingEvaluation.Key)))
                    {
                        this.Context.BuildingEvaluations.Remove(buildingEvaluation);
                    }
                }
            }
            foreach (var parcelEvaluation in existingParcel.Evaluations)
            {
                if (!parcel.Evaluations.Any(e => (e.ParcelId == parcelEvaluation.ParcelId && e.Date == parcelEvaluation.Date && e.Key == parcelEvaluation.Key)))
                {
                    this.Context.ParcelEvaluations.Remove(parcelEvaluation);
                }
            }
            foreach (var parcelFiscals in existingParcel.Fiscals)
            {
                if (!parcel.Fiscals.Any(e => (e.ParcelId == parcelFiscals.ParcelId && e.FiscalYear == parcelFiscals.FiscalYear && e.Key == parcelFiscals.Key)))
                {
                    this.Context.ParcelFiscals.Remove(parcelFiscals);
                }
            }

            // update only an active project with any financial value changes.
            if (!String.IsNullOrWhiteSpace(parcel.ProjectNumber) && (!this.Context.Projects.FirstOrDefault(p => p.ProjectNumber == parcel.ProjectNumber)?.IsProjectClosed(_options.Project) ?? false))
            {
                this.Context.UpdateProjectFinancials(parcel.ProjectNumber);
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
            var existingParcel = this.Context.Parcels
                .Include(p => p.Status)
                .Include(p => p.Agency)
                .Include(p => p.Address)
                .Include(p => p.Evaluations)
                .Include(p => p.Fiscals)
                .Include(p => p.Buildings).ThenInclude(b => b.Evaluations)
                .Include(p => p.Buildings).ThenInclude(b => b.Fiscals)
                .Include(p => p.Buildings).ThenInclude(b => b.Address)
                .SingleOrDefault(u => u.Id == parcel.Id) ?? throw new KeyNotFoundException();

            if (!isAdmin && (!userAgencies.Contains(existingParcel.AgencyId) || existingParcel.IsSensitive && !viewSensitive))
                throw new NotAuthorizedException("User does not have permission to delete.");

            this.ThrowIfNotAllowedToUpdate(existingParcel, _options.Project);
            this.Context.Entry(existingParcel).CurrentValues.SetValues(parcel);
            this.Context.SetOriginalRowVersion(existingParcel);

            existingParcel.Buildings.ForEach((building) =>
            {
                this.ThrowIfNotAllowedToUpdate(building, _options.Project);
                this.Context.BuildingEvaluations.RemoveRange(building.Evaluations);
                this.Context.BuildingFiscals.RemoveRange(building.Fiscals);
                this.Context.Buildings.Remove(building);
            });
            this.Context.ParcelEvaluations.RemoveRange(existingParcel.Evaluations);
            this.Context.ParcelFiscals.RemoveRange(existingParcel.Fiscals);
            this.Context.Parcels.Remove(existingParcel); // TODO: Shouldn't be allowed to permanently delete parcels entirely.
            this.Context.CommitTransaction();
        }

        public bool IsPidAvailable(int parcelId, int PID)
        {
            return !Context.Parcels.Any(parcel => parcel.PID == PID && parcel.Id != parcelId);
        }

        #endregion
    }
}
