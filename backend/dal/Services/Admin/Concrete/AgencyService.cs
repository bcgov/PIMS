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
        /// Add a new agency to the datasource.
        /// The returned agency will contain all users who are affected by the update.
        /// You will need to update Keycloak with this list.
        /// </summary>
        /// <param name="agency"></param>
        public override void Add(Agency agency)
        {
            agency.ThrowIfNull(nameof(agency));

            base.Add(agency);
            this.Context.Entry(agency).State = EntityState.Detached;

            // If the agency has been added as a sub-agency, then all users who are associated with the parent agency need to be updated.
            // Currently in PIMS we only link a user to a single agency (although the DB supports one-to-many).
            // This means that a user linked to a parent-agency will only have a single agency in the DB.
            // However throughout the solution we also give access to all sub-agencies.
            // Keycloak keeps a list of all the agencies that the user is allowed access to (parent + sub-agencies).
            // This means we need to return a list of users that need to be updated in Keycloak.
            if (agency.ParentId.HasValue)
            {
                var users = this.Context.Users.AsNoTracking().Where(u => u.Agencies.Any(a => a.AgencyId == agency.ParentId)).ToArray();
                users.ForEach(u => agency.Users.Add(new UserAgency(u, agency)));
            }
        }

        /// <summary>
        /// Updates the specified agency in the datasource.
        /// The returned agency will contain all users who are affected by the update.
        /// You will need to update Keycloak with this list.
        /// </summary>
        /// <param name="agency"></param>
        /// <exception type="KeyNotFoundException">agency does not exist in the datasource.</exception>
        /// <returns></returns>
        public override void Update(Agency agency)
        {
            agency.ThrowIfNull(nameof(agency));

            var original = this.Context.Agencies.Find(agency.Id) ?? throw new KeyNotFoundException();
            var updatedUsers = new List<User>();

            // If the agency has become a sub-agency, or a parent-agency then users will need to be updated.
            // Currently in PIMS we only link a user to a single agency (although the DB supports one-to-many).
            // This means that a user linked to a parent-agency will only have a single agency in the DB.
            // However throughout the solution we also give access to all sub-agencies.
            // Keycloak keeps a list of all the agencies that the user is allowed access to (parent + sub-agencies).
            // This means we need to return a list of users that need to be updated in Keycloak.
            if (original.ParentId.HasValue && !agency.ParentId.HasValue)
            {
                // This agency has become a parent agency, all users associated with it through a parent-agency need to be removed.
                updatedUsers.AddRange(this.Context.Users.Where(u => u.Agencies.Any(a => a.AgencyId == original.ParentId)));
            }
            else if (!original.ParentId.HasValue && agency.ParentId.HasValue)
            {
                // This agency has become a sub-agency, all original users need their list of agencies reduced to only this agency.
                updatedUsers.AddRange(this.Context.Users.Include(u => u.Agencies).Where(u => u.Agencies.Any(a => a.AgencyId == agency.ParentId)));
            }
            else if (original.ParentId != agency.ParentId)
            {
                // Remove the sub-agency from currently linked users and add it to the users who belong to the new parent agency.
                updatedUsers.AddRange(this.Context.Users.Where(u => u.Agencies.Any(a => a.AgencyId == original.ParentId)));
                updatedUsers.AddRange(this.Context.Users.Where(u => u.Agencies.Any(a => a.AgencyId == agency.ParentId)));
            }

            if (original.IsDisabled != agency.IsDisabled)
            {
                if ((agency.ParentId.HasValue && agency.IsDisabled)
                    || (agency.ParentId.HasValue && !agency.IsDisabled))
                {
                    // Remove the sub-agency from users.
                    // Or add the sub-agency to users who are associated with the parent.
                    updatedUsers.AddRange(this.Context.Users.Where(u => u.Agencies.Any(a => a.AgencyId == agency.ParentId)));
                }
                else if (!agency.ParentId.HasValue && agency.IsDisabled)
                {
                    // Remove the agency from the users.
                    // This will result in the user not belonging to an agency.
                    var users = this.Context.Users.Include(u => u.Agencies).Where(u => u.Agencies.Any(a => a.AgencyId == agency.Id));
                    users.ForEach(u => u.Agencies.Clear());
                    updatedUsers.AddRange(users);
                    this.Context.UpdateRange(users);
                }
            }

            this.Context.Entry(original).CurrentValues.SetValues(agency);
            base.Update(original);

            // Mutate original entity.
            this.Context.Entry(agency).CurrentValues.SetValues(original);
            updatedUsers.Distinct().ForEach(u =>
            {
                this.Context.Entry(u).State = EntityState.Detached;
                agency.Users.Add(new UserAgency(u, agency));
            });
        }

        /// <summary>
        /// Remove the specified agency from the datasource.
        /// The returned agency will contain all users who are affected by the update.
        /// You will need to update Keycloak with this list.
        /// </summary>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <param name="agency"></param>
        public override void Remove(Agency agency)
        {
            agency.ThrowIfNull(nameof(agency));

            var original = this.Context.Agencies.Find(agency.Id) ?? throw new KeyNotFoundException();
            var updateUsers = new List<User>();

            // Any user associated with this agency needs to be updated.
            // Currently in PIMS we only link a user to a single agency (although the DB supports one-to-many).
            // This means that a user linked to a parent-agency will only have a single agency in the DB.
            // However throughout the solution we also give access to all sub-agencies.
            // Keycloak keeps a list of all the agencies that the user is allowed access to (parent + sub-agencies).
            // This means we need to return a list of users that need to be updated in Keycloak.
            if (original.ParentId.HasValue)
            {
                var users = this.Context.Users.Include(u => u.Agencies).Where(u => u.Agencies.Any(a => a.AgencyId == agency.ParentId));
                updateUsers.AddRange(users);
            }
            else
            {
                var users = this.Context.Users.Include(u => u.Agencies).Where(u => u.Agencies.Any(a => a.AgencyId == agency.Id));
                users.ForEach(u => u.Agencies.Clear());
                this.Context.Users.UpdateRange(users);
                updateUsers.AddRange(users);
            }

            this.Context.Entry(original).CurrentValues.SetValues(agency);
            base.Remove(original);

            // Mutate original entity.
            this.Context.Entry(agency).CurrentValues.SetValues(original);
            updateUsers.ForEach(u =>
            {
                this.Context.Entry(u).State = EntityState.Detached;
                agency.Users.Add(new UserAgency(u, agency));
            });
        }
        #endregion
    }
}
