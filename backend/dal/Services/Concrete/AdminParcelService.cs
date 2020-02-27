using System;
using System.Collections.Generic;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Entities;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Pims.Dal.Services
{
    /**
     * EF Core implementation of admin parcel service
     */
    public class AdminParcelService : IAdminParcelService
    {
        private readonly PIMSContext _dbContext;
        private readonly ClaimsPrincipal _user;
        public AdminParcelService(PIMSContext dbContext, ClaimsPrincipal user)
        {
            _dbContext = dbContext;
            _user = user;
        }


        public IEnumerable<Parcel> GetParcels(int page, int quantity, string sort) 
        {
            var entities = _dbContext.Parcels
                .AsNoTracking();
            var pagedEntities = entities.Skip((page - 1) * quantity).Take(quantity);
            return pagedEntities;
        }

        public Parcel GetParcel(int id)
        {
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

        public Parcel GetParcelByPid(int pid)
        {
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
                .AsNoTracking().SingleOrDefault(u => u.ParcelId == pid);
        }

        public Parcel AddParcel(Parcel entity)
        {
            if (entity == null) throw new ArgumentNullException();
            var userId = this._user.GetUserId();
            entity.CreatedById = userId;

            _dbContext.Parcels.Add(entity);
            _dbContext.CommitTransaction();
            return entity;
        }

        public Parcel[] AddParcels(Parcel[] entities)
        {
            var userId = this._user.GetUserId();
            Array.ForEach(entities, (entity) =>
            {
                if (entity == null) throw new ArgumentNullException();
                entity.CreatedById = userId;
            });

            _dbContext.Parcels.AddRange(entities);
            _dbContext.CommitTransaction();
            return entities;
        }

        public Parcel UpdateParcel(Parcel entity)
        {
            if (entity == null) throw new ArgumentNullException();

            if (entity == null) return null;
            var userId = this._user.GetUserId();

            entity.UpdatedById = userId;
            entity.UpdatedOn = DateTime.UtcNow;

            _dbContext.Parcels.Update(entity);
            _dbContext.CommitTransaction();
            return entity;
        }

        public Parcel DeleteParcel(Parcel parcel)
        {
            if (parcel == null) throw new ArgumentNullException();
            var entity = _dbContext.Parcels.Find(parcel.Id);
            if (entity == null) throw new KeyNotFoundException();

            _dbContext.Entry(entity).OriginalValues["RowVersion"] = parcel.RowVersion;
            _dbContext.Parcels.Remove(entity);
            _dbContext.CommitTransaction();

            return entity;
        }
    }
}
