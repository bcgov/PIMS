using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pims.Dal.Entities;
using Pims.Dal.Exceptions;
using Pims.Dal.Helpers.Extensions;

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
        /// Get a collection of parcels within the specified filter.
        /// Will not return sensitive parcels unless the user has the `sensitive-view` claim and belongs to the owning agency.
        /// </summary>
        /// <param name="neLat"></param>
        /// <param name="neLong"></param>
        /// <param name="swLat"></param>
        /// <param name="swLong"></param>
        /// <param name="agencyId"></param>
        /// <param name="propertyClassificationId"></param>
        /// <returns></returns>
        public IEnumerable<Parcel> GetNoTracking(double? neLat = null, double? neLong = null, double? swLat = null, double? swLong = null, int? agencyId = null, int? propertyClassificationId = null)
        {
            // Check if user has the ability to view sensitive properties.
            var userAgencies = this.User.GetAgencies();
            var viewSensitive = this.User.HasRole(Security.RoleClaim.SensitiveView);

            IQueryable<Parcel> query = null;
            if (neLat != null && neLong != null && swLat != null && swLong != null)
            {
                // Users may only view sensitive properties if they have the `sensitive-view` claim and belong to the owning agency.
                query = this.Context.Parcels.AsNoTracking().Where(p =>
                    (!p.IsSensitive || (viewSensitive && userAgencies.Contains(p.AgencyId))) &&
                    p.Latitude <= neLat &&
                    p.Latitude >= swLat &&
                    p.Longitude <= neLong &&
                    p.Longitude >= swLong);
            }
            if (agencyId != null)
            {
                query = query.Where(parcel => parcel.AgencyId == agencyId);
            }
            if (propertyClassificationId != null)
            {
                query = query.Where(parcel => parcel.ClassificationId == propertyClassificationId);
            }
            return query.ToArray();
        }

        /// <summary>
        /// Get the parcel for the specified 'id'.
        /// Will not return sensitive buildings unless the user has the `sensitive-view` claim and belongs to the owning agency.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Parcel GetNoTracking(int id)
        {
            var tmp = this.Context.Parcels.Where(x => x.Id == id);
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
                .AsNoTracking().SingleOrDefault(u => u.Id == id);

            var agencies = this.User.GetAgencies();
            parcel.Buildings.RemoveAll(b => b.IsSensitive && !agencies.Contains(b.AgencyId));
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
            this.User.ThrowIfNotAuthorized("property-add");

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
        /// <returns></returns>
        public Parcel Update(Parcel parcel)
        {
            parcel.ThrowIfNotAllowedToEdit(nameof(parcel), this.User, "property-edit");

            var entity = this.Context.Parcels.Find(parcel.Id);
            if (entity == null) throw new KeyNotFoundException();

            var agency_ids = this.User.GetAgencies();
            if (!agency_ids.Contains(entity.AgencyId)) throw new NotAuthorizedException("User may not edit parcels outside of their agency.");

            // Do not allow switching agencies through this method.
            if (entity.AgencyId != parcel.AgencyId) throw new NotAuthorizedException("Parcel cannot be transferred to the specified agency.");

            this.Context.Parcels.ThrowIfNotUnique(parcel);

            this.Context.Entry(entity).CurrentValues.SetValues(parcel);
            entity.UpdatedById = this.User.GetUserId();
            entity.UpdatedOn = DateTime.UtcNow;

            this.Context.Parcels.Update(entity);
            this.Context.CommitTransaction();
            return entity;
        }

        /// <summary>
        /// Remove the specified parcel from the datasource.
        /// </summary>
        /// <param name="parcel"></param>
        /// <returns></returns>
        public void Remove(Parcel parcel)
        {
            parcel.ThrowIfNotAllowedToEdit(nameof(parcel), this.User, "property-add");

            var entity = this.Context.Parcels.Find(parcel.Id);
            if (entity == null) throw new KeyNotFoundException();

            var agency_ids = this.User.GetAgencies();
            if (!agency_ids.Contains(entity.AgencyId)) throw new NotAuthorizedException("User may not remove parcels outside of their agency.");

            this.Context.Entry(entity).CurrentValues.SetValues(parcel);

            this.Context.Parcels.Remove(entity); // TODO: Shouldn't be allowed to permanently delete parcels entirely.
            this.Context.CommitTransaction();
        }
        #endregion
    }
}
