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
    /// BuildingConstructionTypeService class, provides a service layer to administrate building construction types within the datasource.
    /// </summary>
    public class BuildingConstructionTypeService : BaseService<BuildingConstructionType>, IBuildingConstructionTypeService
    {
        #region Variables
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a BuildingConstructionTypeService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="service"></param>
        /// <param name="logger"></param>
        public BuildingConstructionTypeService(PimsContext dbContext, ClaimsPrincipal user, IPimsService service, ILogger<BuildingConstructionTypeService> logger) : base(dbContext, user, service, logger) { }
        #endregion

        #region Methods
        /// <summary>
        /// Get a page of building construction types from the datasource.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public IEnumerable<BuildingConstructionType> GetAll()
        {
            return this.Context.BuildingConstructionTypes.AsNoTracking().OrderBy(p => p.Name).ToArray();
        }

        /// <summary>
        /// Updates the specified building construction type in the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public override void Update(BuildingConstructionType entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var buildingConstructionType = this.Context.BuildingConstructionTypes.Find(entity.Id);
            if (buildingConstructionType == null) throw new KeyNotFoundException();

            this.Context.Entry(buildingConstructionType).CurrentValues.SetValues(entity);
            base.Update(buildingConstructionType);
        }

        /// <summary>
        /// Remove the specified building construction type from the datasource.
        /// </summary>
        /// <param name="entity"></param>
        public override void Remove(BuildingConstructionType entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var buildingConstructionType = this.Context.BuildingConstructionTypes.Find(entity.Id);
            if (buildingConstructionType == null) throw new KeyNotFoundException();

            this.Context.Entry(buildingConstructionType).CurrentValues.SetValues(entity);
            base.Remove(buildingConstructionType);
        }
        #endregion
    }
}
