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
    /// ParcelService class, provides a service layer to interact with parcels within the datasource.
    /// </summary>
    public class ParcelService : BaseService<Parcel>, IParcelService
    {
        #region Constructors
        /// <summary>
        /// Creates a new instance of a ParcelService, and initializes it with the specified arguments.
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
        /// <param name="neLat"></param>
        /// <param name="neLong"></param>
        /// <param name="swLat"></param>
        /// <param name="swLong"></param>
        /// <returns></returns>
        public IEnumerable<Parcel> GetNoTracking(double neLat, double neLong, double swLat, double swLong)
        {
            // Check if user has the ability to view sensitive properties.
            var userAgencies = this.User.GetAgencies();
            var viewSensitive = this.User.HasPermission(Security.Permissions.SensitiveView);

            // Users may only view sensitive properties if they have the `sensitive-view` claim and belong to the owning agency.
            IQueryable<Parcel> query = this.Context.Parcels.AsNoTracking().Where(p =>
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
        /// Get an array of parcels within the specified filter.
        /// Will not return sensitive parcels unless the user has the `sensitive-view` claim and belongs to the owning agency.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public IEnumerable<Parcel> GetNoTracking(ParcelFilter filter)
        {
            filter.ThrowIfNull(nameof(filter));

            // Check if user has the ability to view sensitive properties.
            var userAgencies = this.User.GetAgencies();
            var viewSensitive = this.User.HasPermission(Security.Permissions.SensitiveView);

            // Users may only view sensitive properties if they have the `sensitive-view` claim and belong to the owning agency.
            var query = this.Context.Parcels.AsNoTracking().Where(p =>
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
            if (filter.ClassificationId.HasValue)
                query = query.Where(p => p.ClassificationId == filter.ClassificationId);
            if (filter.StatusId.HasValue)
                query = query.Where(p => p.StatusId == filter.StatusId);

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

            return query.ToArray();
        }

        /// <summary>
        /// Get the parcel for the specified 'id'.
        /// Will not return sensitive buildings unless the user has the `sensitive-view` claim and belongs to the owning agency.
        /// </summary>
        /// <param name="id"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public Parcel GetNoTracking(int id)
        {
            // Check if user has the ability to view sensitive properties.
            var userAgencies = this.User.GetAgencies();
            var viewSensitive = this.User.HasPermission(Security.Permissions.SensitiveView);

            var parcel = this.Context.Parcels
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
                .Include(p => p.Buildings).ThenInclude(b => b.Evaluations)
                .AsNoTracking()
                .FirstOrDefault(p => p.Id == id &&
                    (!p.IsSensitive || (viewSensitive && userAgencies.Contains(p.AgencyId)))) ?? throw new KeyNotFoundException();

            // Remove any sensitive buildings from the results if the user is not allowed to view them.
            parcel?.Buildings.RemoveAll(b => b.IsSensitive && !userAgencies.Contains(b.AgencyId));
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

            var agency_id = this.User.GetAgency() ??
                throw new NotAuthorizedException("User must belong to an agency before adding parcels.");

            this.Context.Parcels.ThrowIfNotUnique(parcel);

            parcel.CreatedById = this.User.GetUserId();
            parcel.AgencyId = agency_id;
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
            var existingParcel = this.Context.Parcels
                .Include(p => p.Agency)
                .Include(p => p.Address)
                .Include(p => p.Evaluations)
                .Include(p => p.Buildings).ThenInclude(b => b.Evaluations)
                .Include(p => p.Buildings).ThenInclude(b => b.Address)
                .SingleOrDefault(u => u.Id == parcel.Id) ?? throw new KeyNotFoundException();

            parcel.ThrowIfNotAllowedToEdit(nameof(parcel), this.User, "property-edit");

            var userAgencies = this.User.GetAgencies();
            if (!userAgencies.Contains(parcel.AgencyId)) throw new NotAuthorizedException("User may not edit parcels outside of their agency.");

            // Do not allow switching agencies through this method.
            if (existingParcel.AgencyId != parcel.AgencyId) throw new NotAuthorizedException("Parcel cannot be transferred to the specified agency.");

            this.Context.Parcels.ThrowIfNotUnique(parcel);

            //Add/Update a parcel and all child collections
            if (existingParcel == null)
            {
                this.Context.Add(parcel);
            }
            else
            {
                this.Context.Entry(existingParcel).CurrentValues.SetValues(parcel);
                this.Context.Entry(existingParcel.Address).CurrentValues.SetValues(parcel.Address);
                foreach (var building in parcel.Buildings)
                {
                    var existingBuilding = existingParcel.Buildings
                        .FirstOrDefault(b => b.Id == building.Id);
                    this.Context.Entry(existingBuilding.Address).CurrentValues.SetValues(building.Address);
                    if (existingBuilding == null)
                    {
                        existingParcel.Buildings.Add(building);
                    }
                    else
                    {
                        this.Context.Entry(existingBuilding).CurrentValues.SetValues(building);

                        foreach (var buildingEvaluation in building.Evaluations)
                        {
                            var existingBuildingEvaluation = existingBuilding.Evaluations
                                .FirstOrDefault(e => e.BuildingId == buildingEvaluation.BuildingId && e.FiscalYear == buildingEvaluation.FiscalYear);

                            if (existingBuildingEvaluation == null)
                            {
                                existingBuilding.Evaluations.Add(buildingEvaluation);
                            }
                            else
                            {
                                this.Context.Entry(existingBuildingEvaluation).CurrentValues.SetValues(buildingEvaluation);
                            }
                        }
                    }
                }
                foreach (var parcelEvaluation in parcel.Evaluations)
                {
                    var existingEvaluation = existingParcel.Evaluations
                        .FirstOrDefault(e => e.ParcelId == parcelEvaluation.ParcelId && e.FiscalYear == parcelEvaluation.FiscalYear);

                    if (existingEvaluation == null)
                    {
                        existingParcel.Evaluations.Add(parcelEvaluation);
                    }
                    else
                    {
                        this.Context.Entry(existingEvaluation).CurrentValues.SetValues(parcelEvaluation);
                    }
                }
            }

            //Delete any missing records in child collections.
            foreach (var building in existingParcel.Buildings)
            {
                var matchingBuilding = parcel.Buildings.FirstOrDefault(b => b.Id == building.Id);
                if (matchingBuilding == null)
                {
                    this.Context.Buildings.Remove(building);
                    continue;
                }
                foreach (var buildingEvaluation in building.Evaluations)
                {
                    if (!matchingBuilding.Evaluations.Any(e => (e.BuildingId == buildingEvaluation.BuildingId && e.FiscalYear == buildingEvaluation.FiscalYear)))
                    {
                        this.Context.BuildingEvaluations.Remove(buildingEvaluation);
                    }
                }
            }
            foreach (var parcelEvaluation in existingParcel.Evaluations)
            {
                if (!parcel.Evaluations.Any(e => (e.ParcelId == parcelEvaluation.ParcelId && e.FiscalYear == parcelEvaluation.FiscalYear)))
                {
                    this.Context.ParcelEvaluations.Remove(parcelEvaluation);
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
            parcel.ThrowIfNotAllowedToEdit(nameof(parcel), this.User, Permissions.PropertyAdd);

            var entity = this.Context.Parcels.Find(parcel.Id) ?? throw new KeyNotFoundException();

            var agency_ids = this.User.GetAgencies();
            if (!agency_ids.Contains(entity.AgencyId)) throw new NotAuthorizedException("User may not remove parcels outside of their agency.");

            this.Context.Entry(entity).CurrentValues.SetValues(parcel);

            this.Context.Parcels.Remove(entity); // TODO: Shouldn't be allowed to permanently delete parcels entirely.
            this.Context.CommitTransaction();
        }
        #endregion
    }
}
