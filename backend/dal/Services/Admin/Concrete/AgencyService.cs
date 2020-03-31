using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pims.Core.Extensions;
using Pims.Dal.Entities;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// AgencyService class, provides a service layer to administrate agencies within the datasource.
    /// </summary>
    public class AgencyService : BaseService<Agency>, IAgencyService
    {
        #region Variables
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a AgencyService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="logger"></param>
        public AgencyService(PimsContext dbContext, ClaimsPrincipal user, ILogger<AgencyService> logger) : base(dbContext, user, logger) { }
        #endregion

        #region Methods
        /// <summary>
        /// Get a page of agencies from the datasource.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public IEnumerable<Agency> GetAll()
        {
            return this.Context.Agencies.AsNoTracking().OrderBy(p => p.Name).ToArray();
        }

        /// <summary>
        /// Updates the specified agency in the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public override Agency Update(Agency entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var agency = this.Context.Agencies.Find(entity.Id) ?? throw new KeyNotFoundException();

            this.Context.Entry(agency).CurrentValues.SetValues(entity);
            return base.Update(agency);
        }

        /// <summary>
        /// Remove the specified agency from the datasource.
        /// </summary>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <param name="entity"></param>
        public override void Remove(Agency entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var agency = this.Context.Agencies.Find(entity.Id) ?? throw new KeyNotFoundException();

            this.Context.Entry(agency).CurrentValues.SetValues(entity);
            base.Remove(agency);
        }
        #endregion
    }
}
