using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pims.Core.Extensions;
using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;
using Pims.Dal.Exceptions;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;

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
        public Paged<Building> Get(int page, int quantity, string sort)
        {
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            var entities = this.Context.Buildings.AsNoTracking();

            var pagedEntities = entities.Skip((page - 1) * quantity).Take(quantity);
            return new Paged<Building>(pagedEntities, page, quantity, entities.Count());
        }

        /// <summary>
        /// Get the building for the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Building Get(int id)
        {
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            return this.Context.Buildings
                .Include(p => p.BuildingConstructionType)
                .Include(p => p.BuildingPredominateUse)
                .Include(p => p.BuildingOccupantType)
                .Include(p => p.Address)
                .Include(p => p.Address.City)
                .Include(p => p.Address.Province)
                .Include(p => p.Agency)
                .Include(p => p.Agency.Parent)
                .AsNoTracking().SingleOrDefault(u => u.Id == id) ?? throw new KeyNotFoundException();
        }

        /// <summary>
        /// Get the building for the specified 'localId'.
        /// </summary>
        /// <param name="localId"></param>
        /// <returns></returns>
        public Building GetByLocalId(string localId)
        {
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            return this.Context.Buildings
                .Include(p => p.BuildingConstructionType)
                .Include(p => p.BuildingPredominateUse)
                .Include(p => p.BuildingOccupantType)
                .Include(p => p.Address)
                .Include(p => p.Address.City)
                .Include(p => p.Address.Province)
                .Include(p => p.Agency)
                .Include(p => p.Agency.Parent)
                .AsNoTracking().SingleOrDefault(u => u.LocalId == localId) ?? throw new KeyNotFoundException();
        }

        /// <summary>
        /// Get the building for the specified 'pid' and 'localId'.
        /// </summary>
        /// <param name="pid"></param>
        /// <param name="localId"></param>
        /// <returns></returns>
        public Building GetByPidAndLocalId(int pid, string localId)
        {
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            return this.Context.Buildings
                .Include(p => p.BuildingConstructionType)
                .Include(p => p.BuildingPredominateUse)
                .Include(p => p.BuildingOccupantType)
                .Include(p => p.Address)
                .Include(p => p.Address.City)
                .Include(p => p.Address.Province)
                .Include(p => p.Agency)
                .Include(p => p.Agency.Parent)
                .AsNoTracking()
                .SingleOrDefault(u => u.Parcel.PID == pid && u.LocalId == localId) ?? throw new KeyNotFoundException();
        }

        /// <summary>
        /// Add the building to the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public override Building Add(Building entity)
        {
            entity.ThrowIfNull(nameof(entity));
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            if (entity.Agency != null)
                this.Context.Entry(entity.Agency).State = EntityState.Unchanged;
            if (entity.Status != null)
                this.Context.Entry(entity.Status).State = EntityState.Unchanged;
            if (entity.Classification != null)
                this.Context.Entry(entity.Classification).State = EntityState.Unchanged;
            if (entity.BuildingConstructionType != null)
                this.Context.Entry(entity.BuildingConstructionType).State = EntityState.Unchanged;
            if (entity.BuildingPredominateUse != null)
                this.Context.Entry(entity.BuildingPredominateUse).State = EntityState.Unchanged;
            if (entity.BuildingOccupantType != null)
                this.Context.Entry(entity.BuildingOccupantType).State = EntityState.Unchanged;

            this.Context.Addresses.Add(entity.Address);
            this.Context.BuildingEvaluations.AddRange(entity.Evaluations);

            return base.Add(entity);
        }

        /// <summary>
        /// Add the collection of buildings to the datasource.
        /// </summary>
        /// <param name="entities"></param>
        /// <returns></returns>
        public IEnumerable<Building> Add(IEnumerable<Building> entities)
        {
            entities.ThrowIfNull(nameof(entities));
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            var buildings = entities.Where(e => e != null);
            var userId = this.User.GetUserId();
            buildings.ForEach((building) =>
            {
                if (building.Agency != null)
                    this.Context.Entry(building.Agency).State = EntityState.Unchanged;
                if (building.Status != null)
                    this.Context.Entry(building.Status).State = EntityState.Unchanged;
                if (building.Classification != null)
                    this.Context.Entry(building.Classification).State = EntityState.Unchanged;
                if (building.BuildingConstructionType != null)
                    this.Context.Entry(building.BuildingConstructionType).State = EntityState.Unchanged;
                if (building.BuildingPredominateUse != null)
                    this.Context.Entry(building.BuildingPredominateUse).State = EntityState.Unchanged;
                if (building.BuildingOccupantType != null)
                    this.Context.Entry(building.BuildingOccupantType).State = EntityState.Unchanged;

                this.Context.Addresses.Add(building.Address);
                this.Context.BuildingEvaluations.AddRange(building.Evaluations);
            });

            this.Context.Buildings.AddRange(buildings);
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
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

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
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            var building = this.Context.Buildings.Find(entity.Id);
            if (building == null) throw new KeyNotFoundException();

            this.Context.Entry(building).CurrentValues.SetValues(entity);
            base.Remove(building);
        }
        #endregion
    }
}
