using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.Logging;
using Pims.Core.Extensions;
using Pims.Dal.Entities;
using Pims.Dal.Entities.Comparers;
using Pims.Dal.Entities.Models;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

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
        /// <param name="service"></param>
        /// <param name="logger"></param>
        public UserService(PimsContext dbContext, ClaimsPrincipal user, IPimsService service, ILogger<UserService> logger) : base(dbContext, user, service, logger) { }
        #endregion

        #region Methods
        /// <summary>
        /// Get a page of users from the datasource.
        /// The filter will allow queries to search for anything that starts with the following properties; DisplayName, FirstName, LastName, Email, Agencies.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <returns></returns>
        public Paged<User> Get(int page, int quantity)
        {
            return Get(new UserFilter(page, quantity));
        }

        /// <summary>
        /// Get a page of users from the datasource.
        /// The filter will allow queries to search for the following property values; DisplayName, FirstName, LastName, Email, Agencies.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public Paged<User> Get(UserFilter filter = null)
        {
            this.User.ThrowIfNotAuthorized(Permissions.AdminUsers);

            var query = this.Context.Users
                .Include(u => u.Agencies)
                .ThenInclude(a => a.Agency)
                .Include(r => r.Roles)
                .ThenInclude(r => r.Role)
                .AsNoTracking()
                .Where(u => !u.IsSystem);

            var userAgencies = this.User.GetAgencies();
            if (userAgencies != null && User.HasPermission(Permissions.AgencyAdmin) && !User.HasPermission(Permissions.SystemAdmin))
            {
                query = query.Where(user => user.Agencies.Any(a => userAgencies.Contains(a.AgencyId)));
            }

            if (filter != null)
            {
                if (filter.Page < 1) filter.Page = 1;
                if (filter.Quantity < 1) filter.Quantity = 1;
                if (filter.Quantity > 50) filter.Quantity = 50;
                if (filter.Sort == null) filter.Sort = new string[] { };

                if (!string.IsNullOrWhiteSpace(filter.Username))
                    query = query.Where(u => EF.Functions.Like(u.Username, $"%{filter.Username}%"));
                if (!string.IsNullOrWhiteSpace(filter.DisplayName))
                    query = query.Where(u => EF.Functions.Like(u.DisplayName, $"%{filter.DisplayName}%"));
                if (!string.IsNullOrWhiteSpace(filter.FirstName))
                    query = query.Where(u => EF.Functions.Like(u.FirstName, $"%{filter.FirstName}%"));
                if (!string.IsNullOrWhiteSpace(filter.LastName))
                    query = query.Where(u => EF.Functions.Like(u.LastName, $"%{filter.LastName}%"));
                if (!string.IsNullOrWhiteSpace(filter.Email))
                    query = query.Where(u => EF.Functions.Like(u.Email, $"%{filter.Email}%"));
                if (!string.IsNullOrWhiteSpace(filter.Position))
                    query = query.Where(u => EF.Functions.Like(u.Position, $"%{filter.Position}%"));
                if (filter.IsDisabled != null)
                    query = query.Where(u => u.IsDisabled == filter.IsDisabled);
                if (!string.IsNullOrWhiteSpace(filter.Role))
                    query = query.Where(u => u.Roles.Any(r =>
                        EF.Functions.Like(r.Role.Name, $"%{filter.Role}")));
                if (!string.IsNullOrWhiteSpace(filter.Agency))
                    query = query.Where(u => u.Agencies.Any(a =>
                        EF.Functions.Like(a.Agency.Name, $"%{filter.Agency}")));

                if (filter.Sort.Any())
                {
                    if (filter.Sort[0].StartsWith("Agency"))
                    {
                        var direction = filter.Sort[0].Split(" ")[1];
                        query = direction == "asc" ?
                            query.OrderBy(u => u.Agencies.Any() ? u.Agencies.FirstOrDefault().Agency.Name : null)
                            : query.OrderByDescending(u => u.Agencies.Any() ? u.Agencies.FirstOrDefault().Agency.Name : null);
                    }
                    else
                    {
                        query = query.OrderByProperty(filter.Sort);

                    }

                }
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
        public User Get(Guid id)
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
        /// Add the specified user to the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public override void Add(User entity)
        {
            entity.ThrowIfNull(nameof(entity));

            entity.Roles.ForEach(r => this.Context.Entry(r).State = EntityState.Added);
            entity.Agencies.ForEach(a => this.Context.Entry(a).State = EntityState.Added);

            base.Add(entity);
            this.Context.Detach(entity);
        }

        /// <summary>
        /// Updates the specified user in the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public override void Update(User entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var user = this.Context.Users
                .Include(u => u.Agencies)
                .Include(u => u.Roles)
                .AsNoTracking()
                .FirstOrDefault(u => u.Id == entity.Id) ?? throw new KeyNotFoundException();

            this.Context.SetOriginalRowVersion(user);

            var addRoles = entity.Roles.Except(user.Roles, new UserRoleRoleIdComparer());
            addRoles.ForEach(r => this.Context.Entry(r).State = EntityState.Added);
            var removeRoles = user.Roles.Except(entity.Roles, new UserRoleRoleIdComparer());
            removeRoles.ForEach(r => this.Context.Entry(r).State = EntityState.Deleted);

            var addAgencies = entity.Agencies.Except(user.Agencies, new UserAgencyAgencyIdComparer());
            addAgencies.ForEach(a => this.Context.Entry(a).State = EntityState.Added);
            var removeAgencies = user.Agencies.Except(entity.Agencies, new UserAgencyAgencyIdComparer());
            removeAgencies.ForEach(a => this.Context.Entry(a).State = EntityState.Deleted);

            base.Update(entity);
            this.Context.Detach(entity);
        }

        /// <summary>
        /// Remove the specified user from the datasource.
        /// </summary>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <param name="entity"></param>
        public override void Remove(User entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var user = this.Context.Users
                .Include(u => u.Agencies)
                .Include(u => u.Roles)
                .AsNoTracking()
                .FirstOrDefault(u => u.Id == entity.Id) ?? throw new KeyNotFoundException();

            this.Context.SetOriginalRowVersion(user);

            user.Roles.Clear();
            user.Agencies.Clear();

            base.Remove(user);
        }

        /// <summary>
        /// Update the database using the passed AccessRequest
        /// </summary>
        /// <param name="entity"></param>
        public AccessRequest UpdateAccessRequest(AccessRequest entity)
        {
            var accessRequest = GetAccessRequest(entity.Id);
            entity.UpdatedById = this.User.GetUserId(); // TODO: No longer needed.
            entity.UpdatedOn = DateTime.UtcNow;
            this.Context.Entry(accessRequest).CurrentValues.SetValues(entity);
            accessRequest.UserId = accessRequest.User.Id;
            Context.Entry(accessRequest).State = EntityState.Modified;
            this.Context.CommitTransaction();
            return entity;
        }

        /// <summary>
        /// Get the access request with matching id
        /// </summary>
        /// <param name="id"></param>
        public AccessRequest GetAccessRequest(int id)
        {
            this.User.ThrowIfNotAuthorized(Permissions.AdminUsers);

            return this.Context.AccessRequests
                .Include(p => p.Agencies)
                .ThenInclude(p => p.Agency)
                .Include(p => p.Roles)
                .ThenInclude(p => p.Role)
                .Include(p => p.User)
                .AsNoTracking()
                .Where(ar => ar.Id == id)
                .FirstOrDefault() ?? throw new KeyNotFoundException();
        }

        /// <summary>
        /// Get all the access requests that users have submitted to the system
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="sort"></param>
        /// <param name="status"></param>
        public Paged<AccessRequest> GetAccessRequests(int page = 1, int quantity = 10, string sort = null,
            AccessRequestStatus status = AccessRequestStatus.OnHold)
        {
            var sortArray = !string.IsNullOrWhiteSpace(sort) ? new[] { sort } : new string[0];
            var filter = new AccessRequestFilter(page, quantity, sortArray, null, null, null, status);
            return GetAccessRequests(filter);
        }

        /// <summary>
        /// Get all the access requests that users have match the specified filter
        /// </summary>
        /// <param name="filter"></param>
        public Paged<AccessRequest> GetAccessRequests(AccessRequestFilter filter)
        {
            this.User.ThrowIfNotAuthorized(Permissions.AdminUsers);

            var query = this.Context.AccessRequests
                .Include(p => p.Agencies)
                .ThenInclude(p => p.Agency)
                .Include(p => p.Roles)
                .ThenInclude(p => p.Role)
                .Include(p => p.User)
                .AsNoTracking();

            var userAgencies = this.User.GetAgencies();
            if (userAgencies != null && User.HasPermission(Permissions.AgencyAdmin) && !User.HasPermission(Permissions.SystemAdmin))
            {
                query = query.Where(accessRequest => accessRequest.Agencies.Any(a => userAgencies.Contains(a.AgencyId)));
            }

            query = query.Where(request => request.Status == filter.Status);

            if (!string.IsNullOrWhiteSpace(filter.Role))
                query = query.Where(ar => ar.Roles.Any(r =>
                    EF.Functions.Like(r.Role.Name, $"%{filter.Role}%")));

            if (!string.IsNullOrWhiteSpace(filter.Agency))
                query = query.Where(ar => ar.Agencies.Any(a =>
                    EF.Functions.Like(a.Agency.Name, $"%{filter.Agency}%")));

            if (!string.IsNullOrWhiteSpace(filter.SearchText))
            {
                query = query.Where(ar => EF.Functions.Like(ar.User.Username, $"%{filter.SearchText}%"));
            }

            var accessRequests = query.Skip((filter.Page - 1) * filter.Quantity).Take(filter.Quantity);
            return new Paged<AccessRequest>(accessRequests, filter.Page, filter.Quantity, query.Count());
        }

        #endregion
    }
}
