using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;
using Pims.Dal.Exceptions;
using Pims.Dal.Helpers.Extensions;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// BuildingService class, provides a service layer to administrate building objects within the datasource.
    /// </summary>
    public class BuildingService : BaseService<Building>, IBuildingService
    {
        #region Constructors
        /// <summary>
        /// Creates a new instance of a BuildingService class, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="logger"></param>
        public BuildingService(PimsContext dbContext, ClaimsPrincipal user, ILogger<BuildingService> logger) : base(dbContext, user, logger) { }
        #endregion

        #region Methods
        /// <summary>
        /// Get a page of buildings.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public Paged<Building> GetNoTracking(int page, int quantity, string sort)
        {
            // TODO: Check for system-administrator role.
            if (this.User == null) throw new NotAuthorizedException();

            var entities = this.Context.Buildings.AsNoTracking();

            var pagedEntities = entities.Skip((page - 1) * quantity).Take(quantity);
            return new Paged<Building>(pagedEntities, page, quantity, entities.Count());
        }

        /// <summary>
        /// Get the building for the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Building GetNoTracking(int id)
        {
            // TODO: Check for system-administrator role.
            if (this.User == null) throw new NotAuthorizedException();

            return this.Context.Buildings
                .Include(p => p.BuildingConstructionType)
                .Include(p => p.BuildingPredominateUse)
                .Include(p => p.Address)
                .Include(p => p.Address.City)
                .Include(p => p.Address.Province)
                .Include(p => p.Agency)
                .Include(p => p.Agency.Parent)
                .AsNoTracking().SingleOrDefault(u => u.Id == id);
        }

        /// <summary>
        /// Get the building for the specified 'localId'.
        /// </summary>
        /// <param name="localId"></param>
        /// <returns></returns>
        public Building GetByLocalIdNoTracking(string localId)
        {
            // TODO: Check for system-administrator role.
            if (this.User == null) throw new NotAuthorizedException();

            return this.Context.Buildings
                .Include(p => p.BuildingConstructionType)
                .Include(p => p.BuildingPredominateUse)
                .Include(p => p.Address)
                .Include(p => p.Address.City)
                .Include(p => p.Address.Province)
                .Include(p => p.Agency)
                .Include(p => p.Agency.Parent)
                .AsNoTracking().SingleOrDefault(u => u.LocalId == localId);
        }

        /// <summary>
        /// Get the building for the specified 'localId'.
        /// </summary>
        /// <param name="localId"></param>
        /// <returns></returns>
        public Building GetByLocalId(string localId)
        {
            // TODO: Check for system-administrator role.
            if (this.User == null) throw new NotAuthorizedException();

            return this.Context.Buildings
                .Include(p => p.BuildingConstructionType)
                .Include(p => p.BuildingPredominateUse)
                .Include(p => p.Address)
                .Include(p => p.Address.City)
                .Include(p => p.Address.Province)
                .Include(p => p.Agency)
                .Include(p => p.Agency.Parent)
                .SingleOrDefault(u => u.LocalId == localId);
        }

        /// <summary>
        /// Get the building for the specified 'pid' and 'localId'.
        /// </summary>
        /// <param name="pid"></param>
        /// <param name="localId"></param>
        /// <returns></returns>
        public Building GetByPidAndLocalId(int pid, string localId)
        {
            // TODO: Check for system-administrator role.
            if (this.User == null) throw new NotAuthorizedException();

            return this.Context.Buildings
                .Include(p => p.BuildingConstructionType)
                .Include(p => p.BuildingPredominateUse)
                .Include(p => p.Address)
                .Include(p => p.Address.City)
                .Include(p => p.Address.Province)
                .Include(p => p.Agency)
                .Include(p => p.Agency.Parent)
                .SingleOrDefault(u => u.Parcel.PID == pid && u.LocalId == localId);
        }

        /// <summary>
        /// Get the building for the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Building Get(int id)
        {
            var entity = this.Context.Buildings
                .Include(p => p.Address)
                .SingleOrDefault(p => p.Id == id);

            return entity;
        }

        /// <summary>
        /// Add the collection of buildings to the datasource.
        /// </summary>
        /// <param name="entities"></param>
        /// <returns></returns>
        public IEnumerable<Building> Add(IEnumerable<Building> entities)
        {
            entities.ThrowIfNull(nameof(entities));
            this.User.ThrowIfNotAuthorized("system-administrator");

            var userId = this.User.GetUserId();
            entities.ForEach((entity) =>
            {
                if (entity == null) throw new ArgumentNullException();
                entity.CreatedById = userId;
            });

            this.Context.Buildings.AddRange(entities);
            this.Context.CommitTransaction();
            return entities;
        }

        /// <summary>
        /// Update the specified building in the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public override Building Update(Building entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var building = this.Context.Buildings.Find(entity.Id);
            if (building == null) throw new KeyNotFoundException();

            this.Context.Entry(building).CurrentValues.SetValues(entity);
            return base.Update(building);
        }

        /// <summary>
        /// Remove the specified building from the datasource.
        /// </summary>
        /// <param name="entity"></param>
        public override void Remove(Building entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var building = this.Context.Buildings.Find(entity.Id);
            if (building == null) throw new KeyNotFoundException();

            this.Context.Entry(building).CurrentValues.SetValues(entity);
            base.Remove(building);
        }
        #endregion
    }
}
