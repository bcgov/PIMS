using System;
using System.Collections.Generic;
using Pims.Dal.Entities;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Pims.Dal.Services.Concrete
{
    /**
     * EF Core implementation of parcel service
     */
    public class ParcelService : IParcelService
    {
        private readonly PIMSContext _dbContext;
        private readonly ClaimsPrincipal _user;
        public ParcelService(PIMSContext dbContext, ClaimsPrincipal user)
        {
            _dbContext = dbContext;
            _user = user;
        }

        public IEnumerable<Parcel> GetParcels(double? neLat = null, double? neLong = null, double? swLat = null, double? swLong = null)
        {
            if (neLat != null && neLong != null && swLat != null && swLong != null)
            {
                return _dbContext.Parcels.Where(parcel =>
                    parcel.Latitude <= neLat
                    && parcel.Latitude >= swLat
                    && parcel.Longitude <= neLong
                    && parcel.Longitude >= swLong);
            }
            return _dbContext.Parcels;
        }

        public Parcel GetParcel(int id)
        {
            var tmp = _dbContext.Parcels.Where(x => x.Id == id);
            return _dbContext.Parcels
                .Include(p => p.Status)
                .Include(p => p.Classification)
                .Include(p => p.Address)
                .Include(p => p.Address.City)
                .Include(p => p.Address.Province)
                .Include(p => p.Agency)
                .Include(p => p.Agency.Parent)
                .Include(p => p.Buildings)
                .Include(p => p.Buildings).ThenInclude(b => b.Address)
                .Include(p => p.Buildings).ThenInclude(b => b.Address.City)
                .Include(p => p.Buildings).ThenInclude(b => b.Address.Province)
                .Include(p => p.Buildings).ThenInclude(b => b.BuildingConstructionType)
                .Include(p => p.Buildings).ThenInclude(b => b.BuildingPredominateUse)
                .AsNoTracking().SingleOrDefault(u => u.Id == id);
        }

        public Parcel AddMyParcel(Parcel parcel)
        {
            if (parcel == null) throw new ArgumentNullException();
            var entity = new Parcel(parcel.Latitude, parcel.Longitude);

            _dbContext.Parcels.Add(entity);
            _dbContext.SaveChanges();
            return entity;
        }

        public Parcel UpdateMyParcel(Parcel parcel)
        {
            if (parcel == null) throw new ArgumentNullException();
            var userId = new Guid(this._user.FindFirstValue(ClaimTypes.NameIdentifier));
            var entity = _dbContext.Parcels.Find(parcel.Id);
            if (entity == null) throw new KeyNotFoundException();

            // Only admins can update other users parcels.
            if (!IsAllowed(entity))
            {
                throw new UnauthorizedAccessException();
            }

            entity.Latitude = parcel.Latitude;
            entity.Longitude = parcel.Longitude;
            entity.UpdatedById = userId;
            entity.UpdatedOn = DateTime.UtcNow;
            _dbContext.SaveChanges();
            return entity;
        }

        public Parcel DeleteMyParcel(Parcel parcel)
        {
            if (parcel == null) throw new ArgumentNullException();
            var entity = _dbContext.Parcels.Find(parcel.Id);
            if (entity == null) throw new KeyNotFoundException();

            // Only admins can update other users parcels.
            if (!IsAllowed(entity))
            {
                throw new UnauthorizedAccessException();
            }

            entity.RowVersion = parcel.RowVersion.ToArray();
            _dbContext.Parcels.Remove(entity);
            _dbContext.SaveChanges();
            return entity;
        }

        #region Methods
        /// <summary>
        /// Validate that the current user is an administrator or this parcel belongs to them.
        /// </summary>
        /// <param name="parcel">The parcel to test.</param>
        /// <returns>True if the user is allowed.</returns>
        public bool IsAllowed(Parcel parcel)
        {
            var userId = new Guid(this._user.FindFirstValue(ClaimTypes.NameIdentifier));
            var isAdmin = this._user.Claims.Any(c => c.Type == ClaimTypes.Role && c.Value == "administrator");

            // Only admins can update other users parcels.
            return isAdmin || parcel?.CreatedById == userId;
        }
        #endregion
    }
}
