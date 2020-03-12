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
            IQueryable<Parcel> query = null;
            if (neLat != null && neLong != null && swLat != null && swLong != null)
            {
                query = this.Context.Parcels.AsNoTracking().Where(parcel =>
                    parcel.Latitude <= neLat &&
                    parcel.Latitude >= swLat &&
                    parcel.Longitude <= neLong &&
                    parcel.Longitude >= swLong);
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
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Parcel GetNoTracking(int id)
        {
            var tmp = this.Context.Parcels.Where(x => x.Id == id);
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
                .AsNoTracking().SingleOrDefault(u => u.Id == id);
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

            // Verify they the PID and PIN are unique.
            var alreadyExists = this.Context.Parcels.Any(p => (parcel.PID > 0 && p.PID == parcel.PID) || (parcel.PIN != null && p.PIN == parcel.PIN));
            if (alreadyExists) throw new DbUpdateException("PID and PIN values must be unique.");

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

            // Verify they the PID and PIN are unique.
            var alreadyExists = this.Context.Parcels.Any(p => p.Id != parcel.Id && (parcel.PID > 0 && p.PID == parcel.PID) || (parcel.PIN != null && p.PIN == parcel.PIN));
            if (alreadyExists) throw new DbUpdateException("PID and PIN values must be unique.");

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
