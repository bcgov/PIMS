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
                .Include(p => p.Address).ThenInclude(a => a.Province)
                .Include(p => p.Agency).ThenInclude(a => a.Parent)
                .AsNoTracking().SingleOrDefault(u => u.Id == id) ?? throw new KeyNotFoundException();
        }

        /// <summary>
        /// Get the building for the specified 'pid' and 'name'.
        /// This searched for a name that begins the same.
        /// </summary>
        /// <param name="pid"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        public IEnumerable<Building> GetByPid(int pid, string name = null)
        {
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            return this.Context.Buildings
                .Include(p => p.BuildingConstructionType)
                .Include(p => p.BuildingPredominateUse)
                .Include(p => p.BuildingOccupantType)
                .Include(p => p.Address).ThenInclude(a => a.Province)
                .Include(p => p.Agency).ThenInclude(a => a.Parent)
                .Where(b => b.Parcels.Any(pb => pb.Parcel.PID == pid) && (name == null || EF.Functions.Like(b.Name, $"{name}%")));
        }

        /// <summary>
        /// Get the building for the specified 'pid' and 'name'.
        /// This searched for a name that begins the same.
        /// </summary>
        /// <param name="pid"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        public IEnumerable<Building> GetByPidWithoutTracking(int pid, string name = null)
        {
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            return this.Context.Buildings
                .Include(p => p.BuildingConstructionType)
                .Include(p => p.BuildingPredominateUse)
                .Include(p => p.BuildingOccupantType)
                .Include(p => p.Address).ThenInclude(a => a.Province)
                .Include(p => p.Agency).ThenInclude(a => a.Parent)
                .AsNoTracking().Where(b => b.Parcels.Any(pb => pb.Parcel.PID == pid) && (name == null || EF.Functions.Like(b.Name, $"{name}%")));
        }

        /// <summary>
        /// Get the building for the specified 'name'.
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public IEnumerable<Building> GetByName(string name)
        {
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            return this.Context.Buildings
                .Include(p => p.BuildingConstructionType)
                .Include(p => p.BuildingPredominateUse)
                .Include(p => p.BuildingOccupantType)
                .Include(p => p.Address).ThenInclude(a => a.Province)
                .Include(p => p.Agency).ThenInclude(a => a.Parent)
                .Where(b => b.Name == name) ?? throw new KeyNotFoundException();
        }

        /// <summary>
        /// Get the building for the specified 'name'.
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public IEnumerable<Building> GetByNameWithoutTracking(string name)
        {
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            return this.Context.Buildings
                .Include(p => p.BuildingConstructionType)
                .Include(p => p.BuildingPredominateUse)
                .Include(p => p.BuildingOccupantType)
                .Include(p => p.Address).ThenInclude(a => a.Province)
                .Include(p => p.Agency).ThenInclude(a => a.Parent)
                .AsNoTracking().Where(b => b.Name == name) ?? throw new KeyNotFoundException();
        }

        /// <summary>
        /// Load the parcels for the specified building.
        /// </summary>
        /// <param name="building"></param>
        public void LoadParcelsFor(Building building)
        {
            var entry = this.Context.Entry(building);

            if (entry.State == EntityState.Detached)
            {
                entry.State = EntityState.Unchanged;
            }

            entry.Collection(b => b.Parcels)
                .Query()
                .Include(pb => pb.Parcel)
                .Load();
        }

        /// <summary>
        /// Add the building to the datasource.
        /// </summary>
        /// <param name="building"></param>
        /// <returns></returns>
        public override void Add(Building building)
        {
            building.ThrowIfNull(nameof(building));
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            if (building.Agency != null && !this.Context.Agencies.Local.Any(a => a.Id == building.AgencyId))
                this.Context.Entry(building.Agency).State = EntityState.Unchanged;
            if (building.Classification != null && !this.Context.PropertyClassifications.Local.Any(c => c.Id == building.ClassificationId))
                this.Context.Entry(building.Classification).State = EntityState.Unchanged;
            if (building.BuildingConstructionType != null && !this.Context.BuildingConstructionTypes.Local.Any(a => a.Id == building.BuildingConstructionTypeId))
                this.Context.Entry(building.BuildingConstructionType).State = EntityState.Unchanged;
            if (building.BuildingPredominateUse != null && !this.Context.BuildingConstructionTypes.Local.Any(a => a.Id == building.BuildingPredominateUseId))
                this.Context.Entry(building.BuildingPredominateUse).State = EntityState.Unchanged;
            if (building.BuildingOccupantType != null && !this.Context.BuildingOccupantTypes.Local.Any(a => a.Id == building.BuildingOccupantTypeId))
                this.Context.Entry(building.BuildingOccupantType).State = EntityState.Unchanged;

            building.PropertyTypeId = (int)PropertyTypes.Building;
            building.Agency = this.Context.Agencies.Local.FirstOrDefault(a => a.Id == building.AgencyId);
            building.Classification = this.Context.PropertyClassifications.Local.FirstOrDefault(a => a.Id == building.ClassificationId);
            building.BuildingConstructionType = this.Context.BuildingConstructionTypes.Local.FirstOrDefault(a => a.Id == building.BuildingConstructionTypeId);
            building.BuildingPredominateUse = this.Context.BuildingPredominateUses.Local.FirstOrDefault(a => a.Id == building.BuildingPredominateUseId);
            building.BuildingOccupantType = this.Context.BuildingOccupantTypes.Local.FirstOrDefault(a => a.Id == building.BuildingOccupantTypeId);

            if (building.Address != null)
            {
                this.Context.Addresses.Add(building.Address);
            }

            this.Context.BuildingEvaluations.AddRange(building.Evaluations);
            this.Context.BuildingFiscals.AddRange(building.Fiscals);

            base.Add(building);
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
                building.PropertyTypeId = (int)PropertyTypes.Building;
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

            building.PropertyTypeId = originalBuilding.PropertyTypeId;
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
            this.Context.Entry(originalBuilding).Collection(p => p.Parcels).Load();
            this.Context.Entry(originalBuilding).Collection(p => p.Evaluations).Load();
            this.Context.Entry(originalBuilding).Collection(p => p.Fiscals).Load();
            this.Context.Entry(originalBuilding).Collection(p => p.Projects).Load();

            this.Context.Entry(originalBuilding).CurrentValues.SetValues(building);
            originalBuilding.Parcels.Clear();
            originalBuilding.Evaluations.Clear();
            originalBuilding.Fiscals.Clear();
            originalBuilding.Projects.Clear();
            // this.Context.BuildingEvaluations.RemoveRange(originalBuilding.Evaluations);
            // this.Context.BuildingFiscals.RemoveRange(originalBuilding.Fiscals);
            base.Remove(originalBuilding);
        }
        #endregion
    }
}
