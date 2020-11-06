using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pims.Core.Extensions;
using Pims.Dal.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Pims.Dal.Entities.Models;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;

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
        /// <param name="service"></param>
        /// <param name="logger"></param>
        public AgencyService(PimsContext dbContext, ClaimsPrincipal user, IPimsService service, ILogger<AgencyService> logger) : base(dbContext, user, service, logger) { }
        #endregion

        #region Methods
        
        /// <summary>
        /// Get a page of agencies from the datasource.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <returns></returns>
        public Paged<Agency> Get(int page, int quantity)
        {
            return Get(new AgencyFilter(page, quantity));
        }

        /// <summary>
        /// Get a page of agencies from the datasource.
        /// The filter will allow queries to search for the following property values; Name, Description, ParentId.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public Paged<Agency> Get(AgencyFilter filter = null)
        {
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin);

            var query = this.Context.Agencies.AsNoTracking();

            if (filter != null)
            {
                if (filter.Page < 1) filter.Page = 1;
                if (filter.Quantity < 1) filter.Quantity = 1;
                if (filter.Quantity > 50) filter.Quantity = 50;
                if (filter.Sort == null) filter.Sort = new string[] { };

                if (!string.IsNullOrWhiteSpace(filter.Name))
                    query = query.Where(a => EF.Functions.Like(a.Name, $"%{filter.Name}%"));
                if (filter.IsDisabled != null)
                    query = query.Where(a => a.IsDisabled == filter.IsDisabled);
                if (filter.Id > 0)
                    query = query.Where(a => a.Id == filter.Id);

                if (filter.Sort.Any())
                    query = query.OrderByProperty(filter.Sort);
            }
            var agencies = query.Skip((filter.Page - 1) * filter.Quantity).Take(filter.Quantity);
            return new Paged<Agency>(agencies.ToArray(), filter.Page, filter.Quantity, query.Count());
        }


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
        /// Get the agency for the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <exception cref="KeyNotFoundException">Agency does not exists for the specified 'id'.</exception>
        /// <returns></returns>
        public Agency Get(int id)
        {
            return this.Context.Agencies.Find(id) ?? throw new KeyNotFoundException();
        }

        /// <summary>
        /// Updates the specified agency in the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public override void Update(Agency entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var agency = this.Context.Agencies.Find(entity.Id) ?? throw new KeyNotFoundException();

            this.Context.Entry(agency).CurrentValues.SetValues(entity);
            base.Update(agency);
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
