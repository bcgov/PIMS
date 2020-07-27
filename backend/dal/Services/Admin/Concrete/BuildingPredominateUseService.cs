using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pims.Core.Extensions;
using Pims.Dal.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// BuildingPredominateUseService class, provides a service layer to administrate building predominate uses within the datasource.
    /// </summary>
    public class BuildingPredominateUseService : BaseService<BuildingPredominateUse>, IBuildingPredominateUseService
    {
        #region Variables
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a BuildingPredominateUseService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="service"></param>
        /// <param name="logger"></param>
        public BuildingPredominateUseService(PimsContext dbContext, ClaimsPrincipal user, IPimsService service, ILogger<BuildingPredominateUseService> logger) : base(dbContext, user, service, logger) { }
        #endregion

        #region Methods
        /// <summary>
        /// Get a page of building predominate uses from the datasource.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public IEnumerable<BuildingPredominateUse> GetAll()
        {
            return this.Context.BuildingPredominateUses.AsNoTracking().OrderBy(p => p.Name).ToArray();
        }

        /// <summary>
        /// Updates the specified building predominate use in the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public override void Update(BuildingPredominateUse entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var buildingPredominateUse = this.Context.BuildingPredominateUses.Find(entity.Id);
            if (buildingPredominateUse == null) throw new KeyNotFoundException();

            this.Context.Entry(buildingPredominateUse).CurrentValues.SetValues(entity);
            base.Update(buildingPredominateUse);
        }

        /// <summary>
        /// Remove the specified building predominate use from the datasource.
        /// </summary>
        /// <param name="entity"></param>
        public override void Remove(BuildingPredominateUse entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var buildingPredominateUse = this.Context.BuildingPredominateUses.Find(entity.Id);
            if (buildingPredominateUse == null) throw new KeyNotFoundException();

            this.Context.Entry(buildingPredominateUse).CurrentValues.SetValues(entity);
            base.Remove(buildingPredominateUse);
        }
        #endregion
    }
}
