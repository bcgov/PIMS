using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pims.Core.Extensions;
using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// UserService class, provides a service layer to administrate users within the datasource.
    /// </summary>
    public class UserService : BaseService<User>, IUserService
    {
        #region Variables
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a UserService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="logger"></param>
        public UserService(PimsContext dbContext, ClaimsPrincipal user, ILogger<UserService> logger) : base(dbContext, user, logger) { }
        #endregion

        #region Methods
        /// <summary>
        /// Get a page of users from the datasource.
        /// The filter will allow queries to search for anything that starts with the following properties; DisplayName, FirstName, LastName, Email, Agencies.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <returns></returns>
        public Paged<User> GetNoTracking(int page = 1, int quantity = 10)
        {
            return GetNoTracking(new UserFilter(page, quantity));
        }

        /// <summary>
        /// Get a page of users from the datasource.
        /// The filter will allow queries to search for the following property values; DisplayName, FirstName, LastName, Email, Agencies.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public Paged<User> GetNoTracking(UserFilter filter = null)
        {
            this.User.ThrowIfNotAuthorized(Permissions.AdminUsers);
            var query = this.Context.Users
                .Include(u => u.Agencies)
                .ThenInclude(a => a.Agency)
                .Include(r => r.Roles)
                .ThenInclude(r => r.Role)
                .AsNoTracking();

            if (filter.Page < 1) filter.Page = 1;
            if (filter.Quantity < 1) filter.Quantity = 1;
            if (filter.Quantity > 50) filter.Quantity = 50;

            if (filter != null)
            {
                if (!string.IsNullOrWhiteSpace(filter.DisplayName))
                    query = query.Where(u => EF.Functions.Like(u.DisplayName, $"{filter.DisplayName}"));
                if (!string.IsNullOrWhiteSpace(filter.FirstName))
                    query = query.Where(u => EF.Functions.Like(u.FirstName, $"{filter.FirstName}"));
                if (!string.IsNullOrWhiteSpace(filter.LastName))
                    query = query.Where(u => EF.Functions.Like(u.LastName, $"{filter.LastName}"));
                if (!string.IsNullOrWhiteSpace(filter.Email))
                    query = query.Where(u => EF.Functions.Like(u.Email, $"{filter.Email}"));
                if (filter.Agencies?.Any() == true)
                    query = query.Where(u => u.Agencies.Any(a => filter.Agencies.Contains(a.AgencyId)));
                if (filter.Sort?.Any() == true)
                    query = query.OrderByProperty(filter.Sort);
            }
            var users = query.Skip((filter.Page - 1) * filter.Quantity).Take(filter.Quantity);
            return new Paged<User>(users.ToArray(), filter.Page, filter.Quantity, query.Count());
        }

        /// <summary>
        /// Get the user with the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public User GetNoTracking(Guid id)
        {
            this.User.ThrowIfNotAuthorized(Permissions.AdminUsers);

            return this.Context.Users
                .Include(u => u.Roles)
                .ThenInclude(r => r.Role)
                .Include(u => u.Agencies)
                .ThenInclude(a => a.Agency)
                .AsNoTracking()
                .SingleOrDefault(u => u.Id == id) ?? throw new KeyNotFoundException();
        }

        /// <summary>
        /// Get the user for the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public User Get(Guid id)
        {
            this.User.ThrowIfNotAuthorized(Permissions.AdminUsers);

            return this.Context.Users
                .Include(u => u.Roles)
                .ThenInclude(r => r.Role)
                .Include(u => u.Agencies)
                .ThenInclude(a => a.Agency)
                .SingleOrDefault(u => u.Id == id) ?? throw new KeyNotFoundException();
        }

        /// <summary>
        /// Updates the specified user in the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public override User Update(User entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var user = this.Context.Users.Find(entity.Id) ?? throw new KeyNotFoundException();

            this.Context.Entry(user).CurrentValues.SetValues(entity);
            return base.Update(user);
        }

        /// <summary>
        /// Remove the specified user from the datasource.
        /// </summary>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <param name="entity"></param>
        public override void Remove(User entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var user = this.Context.Users.Find(entity.Id) ?? throw new KeyNotFoundException();

            this.Context.Entry(user).CurrentValues.SetValues(entity);
            base.Remove(user);
        }

        /// <summary>
        /// Updates the specified access request in the datasource. if the request is granted, update the associated user as well.
        /// </summary>
        /// <param name="entity"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public AccessRequest Update(AccessRequest entity)
        {
            if(entity.UserId == null)
            {
                throw new ArgumentNullException("userId");
            }
            entity.ThrowIfNull(nameof(entity));
            this.User.ThrowIfNotAuthorized(Permissions.SystemAdmin, Permissions.AgencyAdmin);

            var accessRequest = this.Context.AccessRequests
                .Include(p => p.Agencies)
                .ThenInclude(p => p.Agency)
                .Include(p => p.Roles)
                .ThenInclude(p => p.Role)
                .Include(p => p.User)
                .FirstOrDefault(a => a.Id == entity.Id) ?? throw new KeyNotFoundException();
            if(!accessRequest.IsGranted != true && entity.IsGranted == true && accessRequest.UserId.HasValue)
            {
                User user = Get(accessRequest.UserId.Value);
                entity.Agencies.ForEach((accessRequestAgency) =>
                {
                    if (!user.Agencies.Select(a => a.AgencyId).Contains(accessRequestAgency.AgencyId))
                    {
                        user.Agencies.Add(new UserAgency()
                        {
                            User = user,
                            Agency = this.Context.Agencies.Find(accessRequestAgency.AgencyId)
                        });
                    }
                });
                entity.Roles.ForEach((accessRequestRole) =>
                {
                    if (!user.Roles.Select(r => r.RoleId).Contains(accessRequestRole.RoleId))
                    {
                        user.Roles.Add(new UserRole()
                        {
                            User = user,
                            Role = this.Context.Roles.Find(accessRequestRole.RoleId)
                        });
                    }
                });
                Update(user);
            }

            this.Context.Entry(accessRequest).CurrentValues.SetValues(entity);
            accessRequest.UpdatedById = this.User.GetUserId();
            accessRequest.UpdatedOn = DateTime.UtcNow;
            this.Context.Set<AccessRequest>().Update(accessRequest);

            this.Context.CommitTransaction();
            return accessRequest;
        }

        /// <summary>
        /// Get all the access requests that users have submitted to the system
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="sort"></param>
        /// <param name="isGranted"></param>
        public Paged<AccessRequest> GetAccessRequestsNoTracking(int page = 1, int quantity = 10, string sort = null, bool? isGranted = null)
        {
            this.User.ThrowIfNotAuthorized(Permissions.AdminUsers);

            var query = this.Context.AccessRequests
                .Include(p => p.Agencies)
                .ThenInclude(p => p.Agency)
                .Include(p => p.Roles)
                .ThenInclude(p => p.Role)
                .Include(p => p.User)
                .AsNoTracking()
                .Where(ar => ar.User != null); // Access Requests with no user cannot be granted.

            query = query.Where(request => request.IsGranted == isGranted);
            var accessRequests = query.Skip((page - 1) * quantity).Take(quantity);
            return new Paged<AccessRequest>(accessRequests, page, quantity, query.Count());
        }
        #endregion
    }
}
