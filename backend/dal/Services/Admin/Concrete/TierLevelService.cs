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
    /// TierLevelService class, provides a service layer to administrate tier levels within the datasource.
    /// </summary>
    public class TierLevelService : BaseService<TierLevel>, ITierLevelService
    {
        #region Variables
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a TierLevelService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="service"></param>
        /// <param name="logger"></param>
        public TierLevelService(PimsContext dbContext, ClaimsPrincipal user, IPimsService service, ILogger<TierLevelService> logger) : base(dbContext, user, service, logger) { }
        #endregion

        #region Methods
        /// <summary>
        /// Get a page of tier levels from the datasource.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public IEnumerable<TierLevel> GetAll()
        {
            return this.Context.TierLevels.AsNoTracking().OrderBy(p => p.Name).ToArray();
        }

        /// <summary>
        /// Get the tier level for the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <exception cref="KeyNotFoundException">TierLevel does not exists for the specified 'id'.</exception>
        /// <returns></returns>
        public TierLevel Get(int id)
        {
            return this.Context.TierLevels.Find(id) ?? throw new KeyNotFoundException();
        }

        /// <summary>
        /// Updates the specified tier level in the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public override void Update(TierLevel entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var tierLevel = this.Context.TierLevels.Find(entity.Id) ?? throw new KeyNotFoundException();

            this.Context.Entry(tierLevel).CurrentValues.SetValues(entity);
            base.Update(tierLevel);
        }

        /// <summary>
        /// Remove the specified tier level from the datasource.
        /// </summary>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <param name="entity"></param>
        public override void Remove(TierLevel entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var tierLevel = this.Context.TierLevels.Find(entity.Id) ?? throw new KeyNotFoundException();

            this.Context.Entry(tierLevel).CurrentValues.SetValues(entity);
            base.Remove(tierLevel);
        }
        #endregion
    }
}
