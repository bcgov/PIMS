using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Pims.Core.Extensions;
using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// BuildingService class, provides a service layer to administrate building objects within the datasource.
    /// </summary>
    public class BuildingService : BaseService<Building>, IBuildingService
    {
        #region Variables
        private readonly PimsOptions _options;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a BuildingService class, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="options"></param>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="service"></param>
        /// <param name="logger"></param>
        public BuildingService(IOptions<PimsOptions> options, PimsContext dbContext, ClaimsPrincipal user, IPimsService service, ILogger<BuildingService> logger) : base(dbContext, user, service, logger)
        {
            _options = options.Value;
        }
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
        public override void Add(Building entity)
        {
            entity.ThrowIfNull(nameof(entity));
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            if (entity.Agency != null && !this.Context.Agencies.Local.Any(a => a.Id == entity.AgencyId))
                this.Context.Entry(entity.Agency).State = EntityState.Unchanged;
            if (entity.Classification != null && !this.Context.PropertyClassifications.Local.Any(c => c.Id == entity.ClassificationId))
                this.Context.Entry(entity.Classification).State = EntityState.Unchanged;
            if (entity.BuildingConstructionType != null && !this.Context.BuildingConstructionTypes.Local.Any(a => a.Id == entity.BuildingConstructionTypeId))
                this.Context.Entry(entity.BuildingConstructionType).State = EntityState.Unchanged;
            if (entity.BuildingPredominateUse != null && !this.Context.BuildingConstructionTypes.Local.Any(a => a.Id == entity.BuildingPredominateUseId))
                this.Context.Entry(entity.BuildingPredominateUse).State = EntityState.Unchanged;
            if (entity.BuildingOccupantType != null && !this.Context.BuildingOccupantTypes.Local.Any(a => a.Id == entity.BuildingOccupantTypeId))
                this.Context.Entry(entity.BuildingOccupantType).State = EntityState.Unchanged;

            entity.Agency = this.Context.Agencies.Local.FirstOrDefault(a => a.Id == entity.AgencyId);
            entity.Classification = this.Context.PropertyClassifications.Local.FirstOrDefault(a => a.Id == entity.ClassificationId);
            entity.BuildingConstructionType = this.Context.BuildingConstructionTypes.Local.FirstOrDefault(a => a.Id == entity.BuildingConstructionTypeId);
            entity.BuildingPredominateUse = this.Context.BuildingPredominateUses.Local.FirstOrDefault(a => a.Id == entity.BuildingPredominateUseId);
            entity.BuildingOccupantType = this.Context.BuildingOccupantTypes.Local.FirstOrDefault(a => a.Id == entity.BuildingOccupantTypeId);

            this.Context.Addresses.Add(entity.Address);
            this.Context.BuildingEvaluations.AddRange(entity.Evaluations);

            base.Add(entity);
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
                if (building.Agency != null && !this.Context.Agencies.Local.Any(a => a.Id == building.BuildingOccupantTypeId))
                    this.Context.Entry(building.Agency).State = EntityState.Unchanged;
                if (building.Classification != null && !this.Context.PropertyClassifications.Local.Any(a => a.Id == building.ClassificationId))
                    this.Context.Entry(building.Classification).State = EntityState.Unchanged;
                if (building.BuildingConstructionType != null && !this.Context.BuildingConstructionTypes.Local.Any(a => a.Id == building.BuildingConstructionTypeId))
                    this.Context.Entry(building.BuildingConstructionType).State = EntityState.Unchanged;
                if (building.BuildingPredominateUse != null && !this.Context.BuildingPredominateUses.Local.Any(a => a.Id == building.BuildingPredominateUseId))
                    this.Context.Entry(building.BuildingPredominateUse).State = EntityState.Unchanged;
                if (building.BuildingOccupantType != null && !this.Context.BuildingOccupantTypes.Local.Any(a => a.Id == building.BuildingOccupantTypeId))
                    this.Context.Entry(building.BuildingOccupantType).State = EntityState.Unchanged;

                building.Agency = this.Context.Agencies.Local.FirstOrDefault(a => a.Id == building.AgencyId);
                building.Classification = this.Context.PropertyClassifications.Local.FirstOrDefault(a => a.Id == building.ClassificationId);
                building.BuildingConstructionType = this.Context.BuildingConstructionTypes.Local.FirstOrDefault(a => a.Id == building.BuildingConstructionTypeId);
                building.BuildingPredominateUse = this.Context.BuildingPredominateUses.Local.FirstOrDefault(a => a.Id == building.BuildingPredominateUseId);
                building.BuildingOccupantType = this.Context.BuildingOccupantTypes.Local.FirstOrDefault(a => a.Id == building.BuildingOccupantTypeId);

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
        /// <param name="building"></param>
        /// <returns></returns>
        public override void Update(Building building)
        {
            building.ThrowIfNotAllowedToEdit(nameof(building), this.User, new[] { Permissions.SystemAdmin, Permissions.AgencyAdmin });

            var originalBuilding = this.Context.Buildings
                .Include(b => b.Classification)
                .FirstOrDefault(b => b.Id == building.Id) ?? throw new KeyNotFoundException();
            this.ThrowIfNotAllowedToUpdate(originalBuilding, _options.Project);

            var entry = this.Context.Entry(originalBuilding);
            entry.CurrentValues.SetValues(building);
            entry.Collection(p => p.Evaluations).Load();
            entry.Collection(p => p.Fiscals).Load();

            // TODO: Update child properties appropriately.
            building.Evaluations.ForEach(e =>
            {
                // This will only add an evaluation if it isn't already being tracked.
                if (!originalBuilding.Evaluations.Any(pe => pe.Key == e.Key && pe.Date == e.Date))
                {
                    e.Building = originalBuilding;
                    this.Context.BuildingEvaluations.Add(e);
                }
            });
            building.Fiscals.ForEach(f =>
            {
                // This will only add an fiscal if it isn't already being tracked.
                if (!originalBuilding.Fiscals.Any(pf => pf.Key == f.Key && pf.FiscalYear == f.FiscalYear))
                {
                    f.Building = originalBuilding;
                    this.Context.BuildingFiscals.Add(f);
                }
            });

            base.Update(originalBuilding);
        }

        /// <summary>
        /// Update the specified building financials in the datasource.
        /// </summary>
        /// <param name="building"></param>
        public void UpdateFinancials(Building building)
        {
            building.ThrowIfNull(nameof(building));
            building.ThrowIfNotAllowedToEdit(nameof(building), this.User, new[] { Permissions.SystemAdmin, Permissions.AgencyAdmin });

            var originalBuilding = this.Context.Buildings.Find(building.Id) ?? throw new KeyNotFoundException();

            var entry = this.Context.Entry(originalBuilding);
            entry.Collection(p => p.Evaluations).Load();
            entry.Collection(p => p.Fiscals).Load();

            building.Evaluations.ForEach(e =>
            {
                // This will only add an evaluation if it isn't already being tracked.
                if (!originalBuilding.Evaluations.Any(pe => pe.Key == e.Key && pe.Date == e.Date))
                {
                    e.Building = originalBuilding;
                    this.Context.BuildingEvaluations.Add(e);
                }
            });
            building.Fiscals.ForEach(f =>
            {
                // This will only add an fiscal if it isn't already being tracked.
                if (!originalBuilding.Fiscals.Any(pf => pf.Key == f.Key && pf.FiscalYear == f.FiscalYear))
                {
                    f.Building = originalBuilding;
                    this.Context.BuildingFiscals.Add(f);
                }
            });

            base.Update(originalBuilding);
        }

        /// <summary>
        /// Remove the specified building from the datasource.
        /// </summary>
        /// <param name="building"></param>
        public override void Remove(Building building)
        {
            building.ThrowIfNotAllowedToEdit(nameof(building), this.User, new[] { Permissions.SystemAdmin, Permissions.AgencyAdmin });

            var originalBuilding = this.Context.Buildings.Find(building.Id) ?? throw new KeyNotFoundException();

            this.Context.Entry(originalBuilding).CurrentValues.SetValues(building);
            base.Remove(originalBuilding);
        }
        #endregion
    }
}
